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
      if String.length req.path >= 4 && String.sub req.path 0 4 = "/api"
      then next req
      else Well.csrf next req ) ;

  (* /@axiom: api.md#csrf-selektywne *)

  (* @axiom: api.md#rate-limiting *)
  Well.use (Well.rate_limit ~max_requests:60 ~window_ms:10_000 ()) ;

  (* /@axiom: api.md#rate-limiting *)

  (* /@axiom: infrastructure.md#middleware-stack *)
  Well.Service.register Project_access_impl.spec ;
  Well.Service.register Mock_access_impl.spec ;
  Well.Service.register Comment_access_impl.spec ;

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

  Well.live "/comments" (module Comments_live) ;

  Well.static "/static" "static" ;
  match Sys.getenv_opt "PRODUCTION" with
  | Some "true" -> Well.run ~domain:"smock.finalclass.net" ()
  | _ -> Well.run ()
(* /@axiom: infrastructure.md#punkt-wejścia-aplikacji *)
