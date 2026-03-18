(* @axiom: mock-builder.md#endpoint-aktualizacji-plików-mocka *)
let () =
  Well.post ~middleware:[Api_auth.require_api_key] "/api/projects/:token/mocks/:id/upload" @@ fun req ->
  let ctx = Well.rpc_ctx req in
  let token = Well.param req "token" in
  let project = Project_access.get_by_token ~ctx ~token in
  let caller_project = Api_auth.get_project req in
  (match caller_project with
   | Some p when p.user_id = project.user_id -> ()
   | _ -> failwith "Access denied");
  let mock_id = int_of_string (Well.param req "id") in
  let uploaded = Well.all_files req in
  let files = List.map (fun (_field, (f : Well.uploaded_file)) ->
    (f.filename, f.data)
  ) uploaded in
  let (mock, entry_file, _count) =
    Mock_manager_impl.upload_files ~ctx ~project_id:project.id ~mock_id ~files
  in
  Well.json (`Assoc [
    ("id", `Int mock_id);
    ("name", `String mock.name);
    ("slug", `String mock.slug);
    ("status", `String mock.status);
    ("entry_file", `String entry_file);
  ])
(* /@axiom: mock-builder.md#endpoint-aktualizacji-plików-mocka *)

(* Helpers for AI proxy endpoints *)
let ai_access_url () =
  match Sys.getenv_opt "AI_ACCESS_URL" with
  | Some url -> url
  | None -> "http://localhost:9720"

let ai_access_token () =
  match Sys.getenv_opt "AI_ACCESS_TOKEN" with
  | Some t -> t
  | None -> failwith "AI_ACCESS_TOKEN not set"

let archea_token () =
  match Sys.getenv_opt "ARCHEA_TOKEN" with
  | Some t -> t
  | None -> failwith "ARCHEA_TOKEN not set"

let escape_single_quotes s =
  let buf = Buffer.create (String.length s) in
  String.iter (fun c ->
    if c = '\'' then Buffer.add_string buf "'\\''"
    else Buffer.add_char buf c
  ) s;
  Buffer.contents buf

let http_post ~url ~body ~token =
  let safe_url = escape_single_quotes url in
  let safe_body = escape_single_quotes body in
  let safe_token = escape_single_quotes token in
  let cmd = Printf.sprintf
    "curl -s -X POST '%s' -H 'Authorization: Bearer %s' -H 'Content-Type: application/json' -d '%s'"
    safe_url safe_token safe_body
  in
  let ic = Unix.open_process_in cmd in
  let buf = Buffer.create 1024 in
  (try while true do Buffer.add_char buf (input_char ic) done with End_of_file -> ());
  ignore (Unix.close_process_in ic);
  Buffer.contents buf

let http_get ~url ~token =
  let safe_url = escape_single_quotes url in
  let safe_token = escape_single_quotes token in
  let cmd = Printf.sprintf
    "curl -s -X GET '%s' -H 'Authorization: Bearer %s'"
    safe_url safe_token
  in
  let ic = Unix.open_process_in cmd in
  let buf = Buffer.create 1024 in
  (try while true do Buffer.add_char buf (input_char ic) done with End_of_file -> ());
  ignore (Unix.close_process_in ic);
  Buffer.contents buf

let http_get_with_query ~url ~token ~query =
  let full_url = if query = "" then url else url ^ "?" ^ query in
  http_get ~url:full_url ~token

(* @axiom: mock-builder.md#post-apiprojectsidaisessions *)
let () =
  Well.post "/api/projects/:id/ai/sessions" @@
  Api_auth.require_auth (fun req ->
    let ctx = Well.rpc_ctx req in
    let project_id = int_of_string (Well.param req "id") in
    let project = Project_access.get ~ctx ~id:project_id in
    Api_auth.ensure_project_owner req project;
    let json = Yojson.Safe.from_string req.body in
    let open Yojson.Safe.Util in
    let name = json |> member "name" |> to_string_option |> Option.value ~default:"New Mockup" in
    let mock_id_raw = json |> member "mockId" in
    let mock_id = match mock_id_raw with
      | `Int i -> i
      | `Null | `String "" -> 0
      | _ -> (try to_int mock_id_raw with _ -> 0)
    in
    (* If mockId > 0, use existing mock. Otherwise create a draft mock. *)
    let mock =
      if mock_id > 0 then
        Mock_access.get ~ctx ~id:mock_id
      else begin
        let slug = Slug.generate name in
        Mock_access.create ~ctx ~project_id ~name ~slug ~entry_file:""
      end
    in
    (* Build system prompt body with existing files as context if available *)
    let files_context =
      if mock.id > 0 then begin
        let files_result = Mock_access.list_files ~ctx ~id:mock.id in
        if files_result.files = [] then ""
        else begin
          let file_list = List.map (fun (f : Mock_access.MockFile.t) ->
            match S3_storage.get_file ~project_id ~mock_id:mock.id ~path:f.path with
            | Some data ->
              let ct = f.content_type in
              if String.length ct >= 4 && String.sub ct 0 4 = "text" then
                Printf.sprintf "### File: %s\n```\n%s\n```\n" f.path data
              else
                Printf.sprintf "### File: %s (binary, %d bytes)\n" f.path f.size
            | None -> Printf.sprintf "### File: %s (not found)\n" f.path
          ) files_result.files in
          "\n\n## Existing files:\n" ^ String.concat "\n" file_list
        end
      end else ""
    in
    let issue_body = "You are a mockup builder assistant. Help create or update HTML/CSS mockup files for the project."
      ^ files_context in
    (* Create session at ai-access *)
    let ai_url = ai_access_url () in
    let session_payload = `Assoc [
      ("repoOwner", `String "fc");
      ("repoName", `String "smock");
      ("issueIndex", `Int mock.id);
      ("issueTitle", `String ("Mockup: " ^ mock.name));
      ("issueBody", `String issue_body);
      ("apiToken", `String (archea_token ()));
    ] in
    let response_str = http_post
      ~url:(ai_url ^ "/api/v1/sessions")
      ~body:(Yojson.Safe.to_string session_payload)
      ~token:(ai_access_token ())
    in
    let response_json = Yojson.Safe.from_string response_str in
    let session_id = response_json |> member "sessionId" |> to_string in
    (* Save session id on mock *)
    ignore (Mock_access.set_ai_session ~ctx ~id:mock.id ~ai_session_id:session_id);
    Well.json (`Assoc [
      ("sessionId", `String session_id);
      ("mockId", `Int mock.id);
    ])
  )
(* /@axiom: mock-builder.md#post-apiprojectsidaisessions *)

(* @axiom: mock-builder.md#post-apiprojectsidaisessionssidsend *)
let () =
  Well.post "/api/projects/:id/ai/sessions/:sid/send" @@
  Api_auth.require_auth (fun req ->
    let ctx = Well.rpc_ctx req in
    let project_id = int_of_string (Well.param req "id") in
    let project = Project_access.get ~ctx ~id:project_id in
    Api_auth.ensure_project_owner req project;
    let sid = Well.param req "sid" in
    let ai_url = ai_access_url () in
    let response_str = http_post
      ~url:(ai_url ^ "/api/v1/sessions/" ^ sid ^ "/send")
      ~body:req.body
      ~token:(ai_access_token ())
    in
    Well.json (Yojson.Safe.from_string response_str)
  )
(* /@axiom: mock-builder.md#post-apiprojectsidaisessionssidsend *)

(* @axiom: mock-builder.md#get-apiprojectsidaisessionssidstream *)
let () =
  Well.get "/api/projects/:id/ai/sessions/:sid/stream" @@
  Api_auth.require_auth (fun req ->
    let ctx = Well.rpc_ctx req in
    let project_id = int_of_string (Well.param req "id") in
    let project = Project_access.get ~ctx ~id:project_id in
    Api_auth.ensure_project_owner req project;
    let sid = Well.param req "sid" in
    let ai_url = ai_access_url () in
    let safe_url = escape_single_quotes (ai_url ^ "/api/v1/sessions/" ^ sid ^ "/stream") in
    let safe_token = escape_single_quotes (ai_access_token ()) in
    let cmd = Printf.sprintf
      "curl -s -N '%s' -H 'Authorization: Bearer %s' -H 'Accept: text/event-stream'"
      safe_url safe_token
    in
    let ic = Unix.open_process_in cmd in
    let buf = Buffer.create 4096 in
    (try while true do Buffer.add_char buf (input_char ic) done with End_of_file -> ());
    ignore (Unix.close_process_in ic);
    let data = Buffer.contents buf in
    Well.header "Content-Type" "text/event-stream" (Well.text data)
  )
(* /@axiom: mock-builder.md#get-apiprojectsidaisessionssidstream *)

(* @axiom: mock-builder.md#get-apiprojectsidaisessionssidmessages *)
let () =
  Well.get "/api/projects/:id/ai/sessions/:sid/messages" @@
  Api_auth.require_auth (fun req ->
    let ctx = Well.rpc_ctx req in
    let project_id = int_of_string (Well.param req "id") in
    let project = Project_access.get ~ctx ~id:project_id in
    Api_auth.ensure_project_owner req project;
    let sid = Well.param req "sid" in
    let after_param = match Well.query req "after" with
      | Some v -> "after=" ^ v
      | None -> ""
    in
    let ai_url = ai_access_url () in
    let response_str = http_get_with_query
      ~url:(ai_url ^ "/api/v1/sessions/" ^ sid ^ "/messages")
      ~token:(ai_access_token ())
      ~query:after_param
    in
    Well.json (Yojson.Safe.from_string response_str)
  )
(* /@axiom: mock-builder.md#get-apiprojectsidaisessionssidmessages *)

(* @axiom: mock-builder.md#post-apiprojectsidaisessionssidstop *)
let () =
  Well.post "/api/projects/:id/ai/sessions/:sid/stop" @@
  Api_auth.require_auth (fun req ->
    let ctx = Well.rpc_ctx req in
    let project_id = int_of_string (Well.param req "id") in
    let project = Project_access.get ~ctx ~id:project_id in
    Api_auth.ensure_project_owner req project;
    let sid = Well.param req "sid" in
    let ai_url = ai_access_url () in
    let response_str = http_post
      ~url:(ai_url ^ "/api/v1/sessions/" ^ sid ^ "/stop")
      ~body:"{}"
      ~token:(ai_access_token ())
    in
    Well.json (Yojson.Safe.from_string response_str)
  )
(* /@axiom: mock-builder.md#post-apiprojectsidaisessionssidstop *)
