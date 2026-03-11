(* @axiom: api.md#post-apiprojects--tworzenie-projektu *)
let () =
  Well.post ~middleware:[Api_auth.require_api_key] "/api/projects" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let json = Yojson.Safe.from_string req.body in
  let open Yojson.Safe.Util in
  let name = json |> member "name" |> to_string in
  let caller_project = Api_auth.get_project req in
  let user_id = match caller_project with
    | Some p -> p.user_id
    | None -> failwith "No project context"
  in
  let project = Project_access.create ~ctx ~name ~user_id in
  Well.json (`Assoc [
    ("id", `Int project.id);
    ("name", `String project.name);
    ("token", `String project.token);
    ("api_key", `String project.api_key);
    ("created_at", `String project.created_at);
  ])

(* /@axiom: api.md#post-apiprojects--tworzenie-projektu *)

(* @axiom: api.md#get-apiprojects--lista-projektów *)
let () =
  Well.get ~middleware:[Api_auth.require_api_key] "/api/projects" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let caller_project = Api_auth.get_project req in
  let user_id = match caller_project with
    | Some p -> p.user_id
    | None -> failwith "No project context"
  in
  let result = Project_access.list_by_user ~ctx ~user_id in
  let projects_json = List.map (fun (p : Project_access.Project.t) ->
    `Assoc [
      ("id", `Int p.id);
      ("name", `String p.name);
      ("token", `String p.token);
      ("created_at", `String p.created_at);
    ]
  ) result.projects in
  Well.json (`Assoc [("projects", `List projects_json)])

(* /@axiom: api.md#get-apiprojects--lista-projektów *)

(* @axiom: api.md#post-apiprojectstokenmocks--upload-mocka *)
let () =
  Well.post ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let name = Well.form req "name" in
  let uploaded = Well.all_files req in
  let files = List.map (fun (_field, (f : Well.uploaded_file)) ->
    (f.filename, f.data)
  ) uploaded in
  let mock = Mock_manager_impl.upload_mock ~ctx ~project_id:project.id ~name ~files in
  Well.json (`Assoc [
    ("id", `Int mock.id);
    ("name", `String mock.name);
    ("slug", `String mock.slug);
    ("status", `String mock.status);
    ("entry_file", `String mock.entry_file);
    ("url", `String ("/p/" ^ project.token ^ "/" ^ mock.slug));
  ])

(* /@axiom: api.md#post-apiprojectstokenmocks--upload-mocka *)

(* @axiom: api.md#get-apiprojectstokenmocks--lista-moków *)
let () =
  Well.get ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let result = Mock_access.list_by_project ~ctx ~project_id:project.id in
  let mocks_json = List.map (fun (m : Mock_access.Mock.t) ->
    `Assoc [
      ("id", `Int m.id);
      ("name", `String m.name);
      ("slug", `String m.slug);
      ("status", `String m.status);
      ("entry_file", `String m.entry_file);
      ("created_at", `String m.created_at);
      ("updated_at", `String m.updated_at);
    ]
  ) result.mocks in
  Well.json (`Assoc [("mocks", `List mocks_json)])

(* /@axiom: api.md#get-apiprojectstokenmocks--lista-moków *)

(* @axiom: api.md#put-apiprojectstokenmocksid--zmiana-statusu *)
let () =
  Well.put ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks/:id" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let mock_id = int_of_string (Well.param req "id") in
  let mock_check = Mock_access.get ~ctx ~id:mock_id in
  if mock_check.project_id <> project.id then failwith "Access denied";
  let json = Yojson.Safe.from_string req.body in
  let open Yojson.Safe.Util in
  let status = json |> member "status" |> to_string in
  let mock = Mock_manager_impl.update_status ~ctx ~mock_id ~status in
  Well.json (`Assoc [
    ("id", `Int mock.id);
    ("status", `String mock.status);
    ("updated_at", `String mock.updated_at);
  ])

(* /@axiom: api.md#put-apiprojectstokenmocksid--zmiana-statusu *)

(* @axiom: api.md#delete-apiprojectstokenmocksid--usunięcie-mocka *)
let () =
  Well.delete ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks/:id" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let mock_id = int_of_string (Well.param req "id") in
  let mock_check = Mock_access.get ~ctx ~id:mock_id in
  if mock_check.project_id <> project.id then failwith "Access denied";
  ignore (Mock_manager_impl.delete_mock ~ctx ~mock_id);
  Well.json (`Assoc [("ok", `Bool true)])
(* /@axiom: api.md#delete-apiprojectstokenmocksid--usunięcie-mocka *)
