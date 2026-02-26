(* ProjectAccess implementation — SQLite backend *)

type project_row = {
  id : int;
  name : string;
  token : string;
  api_key : string;
  created_at : string;
} [@@deriving table ~name:"projects"]

let%query all_projects = "SELECT id, name, token, api_key, created_at FROM projects ORDER BY id DESC"
let%query find_project = "SELECT id, name, token, api_key, created_at FROM projects WHERE id = :id"
let%query find_by_token = "SELECT id, name, token, api_key, created_at FROM projects WHERE token = :token"
let%query find_by_api_key = "SELECT id, name, token, api_key, created_at FROM projects WHERE api_key = :api_key"
let%query insert_project = "INSERT INTO projects (name, token, api_key, created_at) VALUES (:name, :token, :api_key, :created_at)"
let%query delete_project = "DELETE FROM projects WHERE id = :id"

let db = lazy (Well.Db.open_db ())
let get_db () = Lazy.force db

let gen_token () =
  let chars = "abcdefghijklmnopqrstuvwxyz0123456789" in
  String.init 8 (fun _ -> chars.[Random.int (String.length chars)])

let gen_api_key () =
  let buf = Buffer.create 32 in
  for _ = 1 to 32 do
    Buffer.add_string buf (Printf.sprintf "%x" (Random.int 16))
  done;
  Buffer.contents buf

let now () =
  let t = Unix.gettimeofday () in
  let tm = Unix.gmtime t in
  Printf.sprintf "%04d-%02d-%02dT%02d:%02d:%02dZ"
    (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
    tm.tm_hour tm.tm_min tm.tm_sec

let project_of_row (r : All_projects.row) : Project_access.Project.t =
  { id = r.id; name = r.name; token = r.token; api_key = r.api_key; created_at = r.created_at }

let project_of_find (r : Find_project.row) : Project_access.Project.t =
  { id = r.id; name = r.name; token = r.token; api_key = r.api_key; created_at = r.created_at }

let project_of_token (r : Find_by_token.row) : Project_access.Project.t =
  { id = r.id; name = r.name; token = r.token; api_key = r.api_key; created_at = r.created_at }

let project_of_api_key (r : Find_by_api_key.row) : Project_access.Project.t =
  { id = r.id; name = r.name; token = r.token; api_key = r.api_key; created_at = r.created_at }

module Impl : Project_access.IMPL with type state = unit = struct
  type state = unit
  let init () = ()

  let list () _ctx (req : Project_access.ListReq.t) =
    let db = get_db () in
    let rows = All_projects.query db in
    let projects = List.map project_of_row rows in
    let projects =
      if req.limit > 0 then
        List.filteri (fun i _ -> i < req.limit) projects
      else projects
    in
    Project_access.ProjectList.make ~projects ()

  let get () _ctx (req : Project_access.IdReq.t) =
    let db = get_db () in
    match Find_project.query db ~id:req.id with
    | r :: _ -> project_of_find r
    | [] -> failwith "Project not found"

  let get_by_token () _ctx (req : Project_access.TokenReq.t) =
    let db = get_db () in
    match Find_by_token.query db ~token:req.token with
    | r :: _ -> project_of_token r
    | [] -> failwith "Project not found"

  let get_by_api_key () _ctx (req : Project_access.ApiKeyReq.t) =
    let db = get_db () in
    match Find_by_api_key.query db ~api_key:req.api_key with
    | r :: _ -> project_of_api_key r
    | [] -> failwith "Project not found"

  let create () _ctx (req : Project_access.CreateReq.t) =
    let db = get_db () in
    let token = gen_token () in
    let api_key = gen_api_key () in
    let created_at = now () in
    Insert_project.exec db ~name:req.name ~token ~api_key ~created_at;
    let id = Int64.to_int (Sqlite3.last_insert_rowid db) in
    Project_access.Project.make ~id ~name:req.name ~token ~api_key ~created_at ()

  let delete () _ctx (req : Project_access.IdReq.t) =
    let db = get_db () in
    Delete_project.exec db ~id:req.id;
    Project_access.Ok.make ~ok:true ()
end

let spec = Project_access.make_spec (module Impl)
