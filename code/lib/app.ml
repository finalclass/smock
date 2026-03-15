(* @axiom: infrastructure.md#punkt-wejścia-aplikacji *)
let auth_error_handler : Well.middleware =
 fun next req ->
  try next req with
  | Well.Auth.Auth_denied _ -> Well.redirect "/login"

let run () =
  (* @axiom: infrastructure.md#middleware-stack *)
  Well.use Well.error_handler ;
  Well.use auth_error_handler ;
  Well.use Well.logger ;
  (* @axiom: api.md#csrf-selektywne *)
  Well.use (fun next req ->
      if (String.length req.path >= 4 && String.sub req.path 0 4 = "/api")
         || (String.length req.path >= 4 && String.sub req.path 0 4 = "/rpc")
      then next req
      else Well.csrf next req ) ;

  (* /@axiom: api.md#csrf-selektywne *)

  (* @axiom: api.md#autoryzacja-rpc *)
  (* Require Bearer api_key for /rpc/* endpoints (AI skills only) *)
  Well.use (fun next req ->
      if String.length req.path >= 5 && String.sub req.path 0 5 = "/rpc/"
      then Api_auth.require_api_key next req
      else next req ) ;
  (* /@axiom: api.md#autoryzacja-rpc *)

  (* @axiom: api.md#rate-limiting *)
  Well.use (Well.rate_limit ~max_requests:60 ~window_ms:10_000 ()) ;

  (* /@axiom: api.md#rate-limiting *)

  (* /@axiom: infrastructure.md#middleware-stack *)
  Well.Service.register Project_access_impl.spec ;
  Well.Service.register Mock_access_impl.spec ;
  Well.Service.register Comment_access_impl.spec ;

  (* @axiom: comments.md#serwer--handler-kanału *)
  Well.Service.expose "CommentAccess" ;

  Well.Channel.channel "comments:*" (fun _req _topic ->
    Ok { Well.Channel.subscribe = [Well.topic_name Events.comment_event] }
  ) ;
  (* /@axiom: comments.md#serwer--handler-kanału *)

  (* @axiom: comments.md#kanał-commentsmockid *)
  (* Client-facing comment API routes — no Bearer required, uses wire format *)
  let comment_to_json (c : Comment_access.Comment.t) =
    `Assoc [("id", `Int c.id); ("thread_id", `Int c.thread_id);
            ("author_name", `String c.author_name); ("body", `String c.body);
            ("created_at", `String c.created_at)]
  in
  let thread_to_json (t : Comment_access.Thread.t) =
    `Assoc [("id", `Int t.id); ("mock_id", `Int t.mock_id);
            ("page_path", `String t.page_path);
            ("x_pct", `Float t.x_pct); ("y_pct", `Float t.y_pct);
            ("resolved", `Bool t.resolved);
            ("created_at", `String t.created_at);
            ("comments", `List (List.map comment_to_json t.comments))]
  in

  Well.post "/api/comments/list" (fun req ->
    let json = Yojson.Safe.from_string req.body in
    let mock_id = Yojson.Safe.Util.(json |> member "mock_id" |> to_int) in
    let ctx = Well.rpc_ctx req in
    let result = Comment_access.list_threads_by_mock ~ctx ~mock_id in
    Well.json (`Assoc [("threads", `List (List.map thread_to_json result.threads))])) ;

  Well.post "/api/comments/create_thread" (fun req ->
    let json = Yojson.Safe.from_string req.body in
    let open Yojson.Safe.Util in
    let to_number j = match j with
      | `Float f -> f | `Int i -> float_of_int i | _ -> 0.0
    in
    let mock_id = json |> member "mock_id" |> to_int in
    let page_path = json |> member "page_path" |> to_string in
    let x_pct = json |> member "x_pct" |> to_number in
    let y_pct = json |> member "y_pct" |> to_number in
    let author_name = json |> member "author_name" |> to_string in
    let body = json |> member "body" |> to_string in
    let ctx = Well.rpc_ctx req in
    let result = Comment_access.create_thread ~ctx ~mock_id ~page_path
      ~x_pct ~y_pct ~author_name ~body in
    Well.json (thread_to_json result)) ;

  Well.post "/api/comments/add_comment" (fun req ->
    let json = Yojson.Safe.from_string req.body in
    let open Yojson.Safe.Util in
    let thread_id = json |> member "thread_id" |> to_int in
    let author_name = json |> member "author_name" |> to_string in
    let body = json |> member "body" |> to_string in
    let ctx = Well.rpc_ctx req in
    let result = Comment_access.add_comment ~ctx ~thread_id ~author_name ~body in
    Well.json (comment_to_json result)) ;

  Well.post "/api/comments/resolve_thread" (fun req ->
    let json = Yojson.Safe.from_string req.body in
    let id = Yojson.Safe.Util.(json |> member "id" |> to_int) in
    let ctx = Well.rpc_ctx req in
    let result = Comment_access.resolve_thread ~ctx ~id in
    Well.json (thread_to_json result)) ;

  Well.post "/api/comments/delete_thread" (fun req ->
    let json = Yojson.Safe.from_string req.body in
    let id = Yojson.Safe.Util.(json |> member "id" |> to_int) in
    let ctx = Well.rpc_ctx req in
    let result = Comment_access.delete_thread ~ctx ~id in
    Well.json (`Assoc [("ok", `Bool result.ok)])) ;
  (* /@axiom: comments.md#kanał-commentsmockid *)

  (match Sys.getenv_opt "SMOCK_ADMIN_KEY" with
   | Some password when password <> "" ->
     let email = match Sys.getenv_opt "SMOCK_ADMIN_EMAIL" with
       | Some e when e <> "" -> e
       | _ -> "admin@smock.local"
     in
     (match Well.Auth.create_seed_user ~login:email ~password with
      | Ok user ->
        Project_access_impl.assign_orphans ~user_id:user.id
      | Error _ ->
        (* User already exists — find by email and assign orphans *)
        (match Well.Auth.find_user_by_email email with
         | Some user ->
           Project_access_impl.assign_orphans ~user_id:user.id
         | None -> ()))
   | _ -> ()) ;

  Well.static "/static" "static" ;
  match Sys.getenv_opt "PRODUCTION" with
  | Some "true" -> Well.run ~port:6000 ~domain:"smock.finalclass.net" ()
  | _ -> Well.run ~port:6000 ()
(* /@axiom: infrastructure.md#punkt-wejścia-aplikacji *)
