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

  (* @axiom: comments.md#kanał-commentsmockid *)
  Well.Channel.channel
    ~on_push:(fun req _topic event payload ->
      let open Yojson.Safe.Util in
      let to_number j = match j with
        | `Float f -> f | `Int i -> float_of_int i | _ -> 0.0
      in
      let ctx = Well.rpc_ctx req in
      match event with
      | "create_thread" ->
        let mock_id = payload |> member "mock_id" |> to_int in
        let page_path = payload |> member "page_path" |> to_string in
        let x_pct = payload |> member "x_pct" |> to_number in
        let y_pct = payload |> member "y_pct" |> to_number in
        let author_name = payload |> member "author_name" |> to_string in
        let body = payload |> member "body" |> to_string in
        let result = Comment_access.create_thread ~ctx ~mock_id ~page_path
          ~x_pct ~y_pct ~author_name ~body in
        { Well.Channel.reply = Some (thread_to_json result);
          broadcast = Some ("thread_created", thread_to_json result) }
      | "add_comment" ->
        let thread_id = payload |> member "thread_id" |> to_int in
        let author_name = payload |> member "author_name" |> to_string in
        let body = payload |> member "body" |> to_string in
        let result = Comment_access.add_comment ~ctx ~thread_id ~author_name ~body in
        { Well.Channel.reply = Some (comment_to_json result);
          broadcast = Some ("comment_added", comment_to_json result) }
      | "resolve_thread" ->
        let thread_id = payload |> member "thread_id" |> to_int in
        let result = Comment_access.resolve_thread ~ctx ~id:thread_id in
        { Well.Channel.reply = Some (thread_to_json result);
          broadcast = Some ("thread_resolved", thread_to_json result) }
      | "delete_thread" ->
        let thread_id = payload |> member "thread_id" |> to_int in
        let result = Comment_access.delete_thread ~ctx ~id:thread_id in
        { Well.Channel.reply = Some (`Assoc [("ok", `Bool result.ok)]);
          broadcast = Some ("thread_deleted",
            `Assoc [("thread_id", `Int thread_id)]) }
      | _ ->
        { Well.Channel.reply = Some (`Assoc [("error", `String "unknown command")]);
          broadcast = None })
    "comments:*"
    (fun req topic ->
      (* join — authorize and return initial thread list *)
      let mock_id_str =
        let len = String.length "comments:" in
        if String.length topic > len then String.sub topic len (String.length topic - len)
        else "0"
      in
      let mock_id = try int_of_string mock_id_str with _ -> 0 in
      let ctx = Well.rpc_ctx req in
      let result = Comment_access.list_threads_by_mock ~ctx ~mock_id in
      let threads_json = `List (List.map thread_to_json result.threads) in
      Ok { Well.Channel.subscribe = ["comments:*"];
           initial_state = Some (`Assoc [("threads", threads_json)]) }
    ) ;
  (* /@axiom: comments.md#kanał-commentsmockid *)
  (* /@axiom: comments.md#serwer--handler-kanału *)

  (* @axiom: mock-builder.md#odświeżanie-podglądu-mocka *)
  Well.Channel.channel
    ~on_push:(fun _req _topic _event _payload ->
      { Well.Channel.reply = None; broadcast = None })
    "mocks:*"
    (fun _req _topic ->
      Ok { Well.Channel.subscribe = ["mocks:*"];
           initial_state = None }
    ) ;
  (* /@axiom: mock-builder.md#odświeżanie-podglądu-mocka *)

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
  | Some "true" -> Well.run ~port:6500 ~domain:"smock.finalclass.net" ()
  | _ -> Well.run ~port:6500 ()
(* /@axiom: infrastructure.md#punkt-wejścia-aplikacji *)
