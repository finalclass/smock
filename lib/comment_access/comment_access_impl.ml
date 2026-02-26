(* CommentAccess implementation — SQLite backend *)

type comment_row = {
  id : int;
  mock_id : int;
  page_path : string;
  x_pct : float;
  y_pct : float;
  author_name : string;
  body : string;
  resolved : int;
  created_at : string;
} [@@deriving table ~name:"comments"]

let%query all_comments_by_mock = "SELECT id, mock_id, page_path, x_pct, y_pct, author_name, body, resolved, created_at FROM comments WHERE mock_id = :mock_id ORDER BY id DESC"
let%query find_comment = "SELECT id, mock_id, page_path, x_pct, y_pct, author_name, body, resolved, created_at FROM comments WHERE id = :id"
let%query insert_comment = "INSERT INTO comments (mock_id, page_path, x_pct, y_pct, author_name, body, resolved, created_at) VALUES (:mock_id, :page_path, :x_pct, :y_pct, :author_name, :body, 0, :created_at)"
let%query resolve_comment = "UPDATE comments SET resolved = 1 WHERE id = :id"
let%query delete_comment = "DELETE FROM comments WHERE id = :id"

let db = lazy (Well.Db.open_db ())
let get_db () = Lazy.force db

let now () =
  let t = Unix.gettimeofday () in
  let tm = Unix.gmtime t in
  Printf.sprintf "%04d-%02d-%02dT%02d:%02d:%02dZ"
    (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
    tm.tm_hour tm.tm_min tm.tm_sec

let comment_of_row (r : All_comments_by_mock.row) : Comment_access.Comment.t =
  { id = r.id; mock_id = r.mock_id; page_path = r.page_path;
    x_pct = r.x_pct; y_pct = r.y_pct; author_name = r.author_name;
    body = r.body; resolved = r.resolved <> 0; created_at = r.created_at }

let comment_of_find (r : Find_comment.row) : Comment_access.Comment.t =
  { id = r.id; mock_id = r.mock_id; page_path = r.page_path;
    x_pct = r.x_pct; y_pct = r.y_pct; author_name = r.author_name;
    body = r.body; resolved = r.resolved <> 0; created_at = r.created_at }

module Impl : Comment_access.IMPL with type state = unit = struct
  type state = unit
  let init () = ()

  let list_by_mock () _ctx (req : Comment_access.MockReq.t) =
    let db = get_db () in
    let rows = All_comments_by_mock.query db ~mock_id:req.mock_id in
    let comments = List.map comment_of_row rows in
    Comment_access.CommentList.make ~comments ()

  let create () _ctx (req : Comment_access.CreateReq.t) =
    let db = get_db () in
    let created_at = now () in
    Insert_comment.exec db ~mock_id:req.mock_id ~page_path:req.page_path
      ~x_pct:req.x_pct ~y_pct:req.y_pct ~author_name:req.author_name
      ~body:req.body ~created_at;
    let id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    Comment_access.Comment.make ~id ~mock_id:req.mock_id ~page_path:req.page_path
      ~x_pct:req.x_pct ~y_pct:req.y_pct ~author_name:req.author_name
      ~body:req.body ~resolved:false ~created_at ()

  let resolve () _ctx (req : Comment_access.IdReq.t) =
    let db = get_db () in
    Resolve_comment.exec db ~id:req.id;
    match Find_comment.query db ~id:req.id with
    | r :: _ -> comment_of_find r
    | [] -> failwith "Comment not found"

  let delete () _ctx (req : Comment_access.IdReq.t) =
    let db = get_db () in
    Delete_comment.exec db ~id:req.id;
    Comment_access.Ok.make ~ok:true ()
end

let spec = Comment_access.make_spec (module Impl)
