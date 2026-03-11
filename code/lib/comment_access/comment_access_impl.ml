(* @axiom: data-model.md#tabela-threads *)
type thread_row = {
  id : int;
  mock_id : int;
  page_path : string;
  x_pct : float;
  y_pct : float;
  resolved : int;
  created_at : string;
} [@@deriving table ~name:"threads"]
(* /@axiom: data-model.md#tabela-threads *)

(* @axiom: data-model.md#tabela-comments *)
type comment_row = {
  id : int;
  thread_id : int;
  author_name : string;
  body : string;
  created_at : string;
} [@@deriving table ~name:"comments"]
(* /@axiom: data-model.md#tabela-comments *)

(* @axiom: comment-access.md#commentaccess *)
let%query all_threads_by_mock = "SELECT id, mock_id, page_path, x_pct, y_pct, resolved, created_at FROM threads WHERE mock_id = :mock_id ORDER BY id DESC"
let%query find_thread = "SELECT id, mock_id, page_path, x_pct, y_pct, resolved, created_at FROM threads WHERE id = :id"
let%query insert_thread = "INSERT INTO threads (mock_id, page_path, x_pct, y_pct, resolved, created_at) VALUES (:mock_id, :page_path, :x_pct, :y_pct, 0, :created_at)"
let%query resolve_thread_q = "UPDATE threads SET resolved = 1 WHERE id = :id"
let%query delete_thread_q = "DELETE FROM threads WHERE id = :id"

let%query comments_by_thread = "SELECT id, thread_id, author_name, body, created_at FROM comments WHERE thread_id = :thread_id ORDER BY id ASC"
let%query insert_comment = "INSERT INTO comments (thread_id, author_name, body, created_at) VALUES (:thread_id, :author_name, :body, :created_at)"
let%query delete_comments_by_thread = "DELETE FROM comments WHERE thread_id = :thread_id"

let db = lazy (Well.Db.open_db ())
let get_db () = Lazy.force db

let now () =
  let t = Unix.gettimeofday () in
  let tm = Unix.gmtime t in
  Printf.sprintf "%04d-%02d-%02dT%02d:%02d:%02dZ"
    (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
    tm.tm_hour tm.tm_min tm.tm_sec

let comment_of_row (r : Comments_by_thread.row) : Comment_access.Comment.t =
  { id = r.id; thread_id = r.thread_id;
    author_name = r.author_name; body = r.body;
    created_at = r.created_at }

let load_comments_for_thread db thread_id =
  let rows = Comments_by_thread.query db ~thread_id in
  List.map comment_of_row rows

let thread_of_row db (r : All_threads_by_mock.row) : Comment_access.Thread.t =
  let comments = load_comments_for_thread db r.id in
  { id = r.id; mock_id = r.mock_id; page_path = r.page_path;
    x_pct = r.x_pct; y_pct = r.y_pct;
    resolved = r.resolved <> 0; created_at = r.created_at;
    comments }

let thread_of_find db (r : Find_thread.row) : Comment_access.Thread.t =
  let comments = load_comments_for_thread db r.id in
  { id = r.id; mock_id = r.mock_id; page_path = r.page_path;
    x_pct = r.x_pct; y_pct = r.y_pct;
    resolved = r.resolved <> 0; created_at = r.created_at;
    comments }

module Impl : Comment_access.IMPL with type state = unit = struct
  type state = unit
  let init () = ()

  let list_threads_by_mock () _ctx (req : Comment_access.MockReq.t) =
    let db = get_db () in
    let rows = All_threads_by_mock.query db ~mock_id:req.mock_id in
    let threads = List.map (thread_of_row db) rows in
    Comment_access.ThreadList.make ~threads ()

  let create_thread () _ctx (req : Comment_access.CreateThreadReq.t) =
    let db = get_db () in
    let created_at = now () in
    Insert_thread.exec db ~mock_id:req.mock_id ~page_path:req.page_path
      ~x_pct:req.x_pct ~y_pct:req.y_pct ~created_at;
    let thread_id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    Insert_comment.exec db ~thread_id ~author_name:req.author_name
      ~body:req.body ~created_at;
    let comment_id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    let comment : Comment_access.Comment.t =
      { id = comment_id; thread_id; author_name = req.author_name;
        body = req.body; created_at }
    in
    Well.publish Events.comment_event (`ThreadCreated (req.mock_id, thread_id));
    Comment_access.Thread.make ~id:thread_id ~mock_id:req.mock_id
      ~page_path:req.page_path ~x_pct:req.x_pct ~y_pct:req.y_pct
      ~resolved:false ~created_at ~comments:[comment] ()

  let add_comment () _ctx (req : Comment_access.AddCommentReq.t) =
    let db = get_db () in
    let created_at = now () in
    Insert_comment.exec db ~thread_id:req.thread_id
      ~author_name:req.author_name ~body:req.body ~created_at;
    let id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    (* Look up mock_id from thread for event publishing *)
    (match Find_thread.query db ~id:req.thread_id with
     | r :: _ -> Well.publish Events.comment_event (`CommentAdded (r.mock_id, req.thread_id))
     | [] -> ());
    Comment_access.Comment.make ~id ~thread_id:req.thread_id
      ~author_name:req.author_name ~body:req.body ~created_at ()

  let resolve_thread () _ctx (req : Comment_access.IdReq.t) =
    let db = get_db () in
    Resolve_thread_q.exec db ~id:req.id;
    match Find_thread.query db ~id:req.id with
    | r :: _ ->
      Well.publish Events.comment_event (`ThreadResolved (r.mock_id, req.id));
      thread_of_find db r
    | [] -> failwith "Thread not found"

  let delete_thread () _ctx (req : Comment_access.IdReq.t) =
    let db = get_db () in
    (* Look up mock_id before deleting *)
    let mock_id = match Find_thread.query db ~id:req.id with
      | r :: _ -> r.mock_id
      | [] -> 0
    in
    Delete_comments_by_thread.exec db ~thread_id:req.id;
    Delete_thread_q.exec db ~id:req.id;
    Well.publish Events.comment_event (`ThreadDeleted (mock_id, req.id));
    Comment_access.Ok.make ~ok:true ()
end

let spec = Comment_access.make_spec (module Impl)
(* /@axiom: comment-access.md#commentaccess *)
