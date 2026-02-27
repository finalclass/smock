let setup_seed_user () =
  match Sys.getenv_opt "SMOCK_ADMIN_KEY" with
  | None
   |Some "" ->
      ()
  | Some admin_key -> (
      let email =
        match Sys.getenv_opt "SMOCK_ADMIN_EMAIL" with
        | Some e -> e
        | None -> "admin@smock.local"
      in
      let user_id = match Well.Auth.register ~email ~password:admin_key with
        | Ok user ->
            Printf.printf "Seed user created: %s (id=%d)\n%!" email user.id ;
            user.id
        | Error _ -> (
          match Well.Auth.login ~email ~password:admin_key with
          | Ok user -> user.id
          | Error _ -> 0 )
      in
      if user_id > 0 then
        Project_access_impl.assign_orphans ~user_id )

let auth_error_handler : Well.middleware =
 fun next req ->
  try next req with
  | Well.Auth.Auth_denied _ -> Well.redirect "/login"

let run () =
  Well.use Well.error_handler ;
  Well.use auth_error_handler ;
  Well.use Well.logger ;
  Well.use (fun next req ->
      if String.length req.path >= 4 && String.sub req.path 0 4 = "/api"
      then next req
      else Well.csrf next req ) ;
  Well.use (Well.rate_limit ~max_requests:60 ~window_ms:10_000 ()) ;

  (* Services — IDesign: Manager → Access → DB *)
  Well.Service.register Project_access_impl.spec ;
  Well.Service.register Mock_access_impl.spec ;
  Well.Service.register Comment_access_impl.spec ;

  (* Seed user setup from env *)
  setup_seed_user () ;

  (* LiveView *)
  Well.live "/comments" (module Comments_live) ;

  Well.static "/static" "static" ;
  match Sys.getenv_opt "PRODUCTION" with
  | Some "true" -> Well.run ~domain:"smock.finalclass.net" ()
  | _ -> Well.run ()
