(* MockAccess implementation — SQLite backend *)

type mock_row = {
  id : int;
  project_id : int;
  name : string;
  slug : string;
  status : string;
  entry_file : string;
  created_at : string;
  updated_at : string;
} [@@deriving table ~name:"mocks"]

type mock_file_row = {
  id : int;
  mock_id : int;
  path : string;
  content_type : string;
  size : int;
} [@@deriving table ~name:"mock_files"]

let%query all_mocks_by_project = "SELECT id, project_id, name, slug, status, entry_file, created_at, updated_at FROM mocks WHERE project_id = :project_id ORDER BY id DESC"
let%query find_mock = "SELECT id, project_id, name, slug, status, entry_file, created_at, updated_at FROM mocks WHERE id = :id"
let%query find_mock_by_slug = "SELECT id, project_id, name, slug, status, entry_file, created_at, updated_at FROM mocks WHERE project_id = :project_id AND slug = :slug"
let%query insert_mock = "INSERT INTO mocks (project_id, name, slug, status, entry_file, created_at, updated_at) VALUES (:project_id, :name, :slug, :status, :entry_file, :created_at, :updated_at)"
let%query update_mock_status = "UPDATE mocks SET status = :status, updated_at = :updated_at WHERE id = :id"
let%query delete_mock = "DELETE FROM mocks WHERE id = :id"
let%query insert_mock_file = "INSERT INTO mock_files (mock_id, path, content_type, size) VALUES (:mock_id, :path, :content_type, :size)"
let%query all_mock_files = "SELECT id, mock_id, path, content_type, size FROM mock_files WHERE mock_id = :mock_id ORDER BY path"
let%query delete_mock_files = "DELETE FROM mock_files WHERE mock_id = :mock_id"

let db = lazy (Well.Db.open_db ())
let get_db () = Lazy.force db

let now () =
  let t = Unix.gettimeofday () in
  let tm = Unix.gmtime t in
  Printf.sprintf "%04d-%02d-%02dT%02d:%02d:%02dZ"
    (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
    tm.tm_hour tm.tm_min tm.tm_sec

let mock_of_row (r : All_mocks_by_project.row) : Mock_access.Mock.t =
  { id = r.id; project_id = r.project_id; name = r.name; slug = r.slug;
    status = r.status; entry_file = r.entry_file;
    created_at = r.created_at; updated_at = r.updated_at }

let mock_of_find (r : Find_mock.row) : Mock_access.Mock.t =
  { id = r.id; project_id = r.project_id; name = r.name; slug = r.slug;
    status = r.status; entry_file = r.entry_file;
    created_at = r.created_at; updated_at = r.updated_at }

let mock_of_slug (r : Find_mock_by_slug.row) : Mock_access.Mock.t =
  { id = r.id; project_id = r.project_id; name = r.name; slug = r.slug;
    status = r.status; entry_file = r.entry_file;
    created_at = r.created_at; updated_at = r.updated_at }

let file_of_row (r : All_mock_files.row) : Mock_access.MockFile.t =
  { id = r.id; mock_id = r.mock_id; path = r.path;
    content_type = r.content_type; size = r.size }

module Impl : Mock_access.IMPL with type state = unit = struct
  type state = unit
  let init () = ()

  let list_by_project () _ctx (req : Mock_access.ProjectReq.t) =
    let db = get_db () in
    let rows = All_mocks_by_project.query db ~project_id:req.project_id in
    let mocks = List.map mock_of_row rows in
    Mock_access.MockList.make ~mocks ()

  let get () _ctx (req : Mock_access.IdReq.t) =
    let db = get_db () in
    match Find_mock.query db ~id:req.id with
    | r :: _ -> mock_of_find r
    | [] -> failwith "Mock not found"

  let get_by_slug () _ctx (req : Mock_access.SlugReq.t) =
    let db = get_db () in
    match Find_mock_by_slug.query db ~project_id:req.project_id ~slug:req.slug with
    | r :: _ -> mock_of_slug r
    | [] -> failwith "Mock not found"

  let create () _ctx (req : Mock_access.CreateReq.t) =
    let db = get_db () in
    let ts = now () in
    Insert_mock.exec db ~project_id:req.project_id ~name:req.name
      ~slug:req.slug ~status:"draft" ~entry_file:req.entry_file
      ~created_at:ts ~updated_at:ts;
    let id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    Mock_access.Mock.make ~id ~project_id:req.project_id ~name:req.name
      ~slug:req.slug ~status:"draft" ~entry_file:req.entry_file
      ~created_at:ts ~updated_at:ts ()

  let update_status () _ctx (req : Mock_access.StatusReq.t) =
    let db = get_db () in
    let ts = now () in
    Update_mock_status.exec db ~status:req.status ~updated_at:ts ~id:req.id;
    match Find_mock.query db ~id:req.id with
    | r :: _ -> mock_of_find r
    | [] -> failwith "Mock not found"

  let delete () _ctx (req : Mock_access.IdReq.t) =
    let db = get_db () in
    Delete_mock_files.exec db ~mock_id:req.id;
    Delete_mock.exec db ~id:req.id;
    Mock_access.Ok.make ~ok:true ()

  let add_file () _ctx (req : Mock_access.AddFileReq.t) =
    let db = get_db () in
    Insert_mock_file.exec db ~mock_id:req.mock_id ~path:req.path
      ~content_type:req.content_type ~size:req.size;
    let id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    Mock_access.MockFile.make ~id ~mock_id:req.mock_id ~path:req.path
      ~content_type:req.content_type ~size:req.size ()

  let list_files () _ctx (req : Mock_access.IdReq.t) =
    let db = get_db () in
    let rows = All_mock_files.query db ~mock_id:req.id in
    let files = List.map file_of_row rows in
    Mock_access.MockFileList.make ~files ()
end

let spec = Mock_access.make_spec (module Impl)
