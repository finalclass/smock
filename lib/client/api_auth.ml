(* API auth — Bearer token middleware and admin key check *)

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

let require_admin_key : Well.middleware = fun next req ->
  match extract_bearer req with
  | None ->
    Well.json (`Assoc [("error", `String "Missing Authorization header")]) |> Well.status 401
  | Some key ->
    let admin_key = match Sys.getenv_opt "SMOCK_ADMIN_KEY" with
      | Some k -> k
      | None -> failwith "SMOCK_ADMIN_KEY not set"
    in
    if key = admin_key then
      next req
    else
      Well.json (`Assoc [("error", `String "Invalid admin key")]) |> Well.status 401
