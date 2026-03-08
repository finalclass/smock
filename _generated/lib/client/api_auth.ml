(* @axiom: auth.md#bearer-token-api *)
module ProjectCtx = Well.Context(struct
  type t = Project_access.Project.t option
  let empty = None
end)

let get_project = ProjectCtx.get

let extract_bearer (req : Well.request) =
  match List.assoc_opt "authorization" req.headers with
  | Some h ->
    let h = String.trim h in
    if String.length h > 7 && String.sub (String.lowercase_ascii h) 0 7 = "bearer " then
      Some (String.trim (String.sub h 7 (String.length h - 7)))
    else None
  | None -> None

let require_api_key : Well.middleware = fun next req ->
  match extract_bearer req with
  | None ->
    Well.json (`Assoc [("error", `String "Missing Authorization header")]) |> Well.status 401
  | Some key ->
    let ctx = Well.rpc_ctx req in
    let project =
      try Some (Project_access.get_by_api_key ~ctx ~api_key:key)
      with _ -> None
    in
    (match project with
    | None ->
      Well.json (`Assoc [("error", `String "Invalid API key")]) |> Well.status 401
    | Some project ->
      next (ProjectCtx.set (Some project) req))
(* /@axiom: auth.md#bearer-token-api *)

(* @axiom: auth.md#właścicielstwo-projektów *)
let require_auth (handler : Well.request -> 'a) (req : Well.request) : 'a =
  match Well.current_user req with
  | Some _ -> handler req
  | None -> raise (Well.Auth.Auth_denied (401, "Login required"))

let current_user_id (req : Well.request) : int =
  match Well.current_user req with
  | Some uid -> int_of_string uid
  | None -> raise (Well.Auth.Auth_denied (401, "Login required"))

let ensure_project_owner (req : Well.request) (project : Project_access.Project.t) =
  let uid = current_user_id req in
  if project.user_id <> uid then
    raise (Well.Auth.Auth_denied (403, "Not your project"))
(* /@axiom: auth.md#właścicielstwo-projektów *)
