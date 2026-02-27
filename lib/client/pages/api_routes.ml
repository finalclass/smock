(* API routes — REST endpoints for Smock *)

let () =
  (* POST /api/projects — create project (requires api_key, inherits user_id) *)
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

let () =
  (* GET /api/projects — list projects scoped to api_key owner *)
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

let () =
  (* POST /api/projects/:token/mocks — upload mock (multipart, requires api_key) *)
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

let () =
  (* GET /api/projects/:token/mocks — list mocks (requires api_key) *)
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

let () =
  (* PUT /api/projects/:token/mocks/:id — update status (requires api_key) *)
  Well.put ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks/:id" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let mock_id = int_of_string (Well.param req "id") in
  let json = Yojson.Safe.from_string req.body in
  let open Yojson.Safe.Util in
  let status = json |> member "status" |> to_string in
  let mock = Mock_manager_impl.update_status ~ctx ~mock_id ~status in
  Well.json (`Assoc [
    ("id", `Int mock.id);
    ("status", `String mock.status);
    ("updated_at", `String mock.updated_at);
  ])

let () =
  (* DELETE /api/projects/:token/mocks/:id — delete mock (requires api_key) *)
  Well.delete ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks/:id" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let mock_id = int_of_string (Well.param req "id") in
  ignore (Mock_manager_impl.delete_mock ~ctx ~mock_id);
  Well.json (`Assoc [("ok", `Bool true)])

let () =
  (* GET /api/mocks/:mock_id/comments — list comments for a mock (requires api_key) *)
  Well.get ~middleware:[Api_auth.require_api_key] "/api/mocks/:mock_id/comments" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let mock_id = int_of_string (Well.param req "mock_id") in
  let project = match Api_auth.get_project req with
    | Some p -> p
    | None -> failwith "No project in context"
  in
  let mock = Mock_access.get ~ctx ~id:mock_id in
  if mock.project_id <> project.id then
    Well.json (`Assoc [("error", `String "Access denied")]) |> Well.status 403
  else
    let result = Comment_access.list_by_mock ~ctx ~mock_id in
    let comments_json = List.map (fun (c : Comment_access.Comment.t) ->
      `Assoc [
        ("id", `Int c.id);
        ("mock_id", `Int c.mock_id);
        ("page_path", `String c.page_path);
        ("x_pct", `Float c.x_pct);
        ("y_pct", `Float c.y_pct);
        ("author_name", `String c.author_name);
        ("body", `String c.body);
        ("resolved", `Bool c.resolved);
        ("created_at", `String c.created_at);
      ]
    ) result.comments in
    Well.json (`Assoc [("comments", `List comments_json)])
