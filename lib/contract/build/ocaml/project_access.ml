[@@@warning "-32"]

module Project = struct
  type t = {
    id : int;
    name : string;
    token : string;
    api_key : string;
    created_at : string;
  }

  let make ~id ~name ~token ~api_key ~created_at () =
    { id; name; token; api_key; created_at }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `String v.name;
      `String v.token;
      `String v.api_key;
      `String v.created_at;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let name = (match (_g 1) with `String s -> s | _ -> "") in
      let token = (match (_g 2) with `String s -> s | _ -> "") in
      let api_key = (match (_g 3) with `String s -> s | _ -> "") in
      let created_at = (match (_g 4) with `String s -> s | _ -> "") in
      { id; name; token; api_key; created_at }
    | _ -> failwith "Project.of_wire: expected JSON array"
end

module ListReq = struct
  type t = {
    limit : int;
  }

  let make ~limit () =
    { limit }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.limit;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let limit = (match (_g 0) with `Int i -> i | _ -> 0) in
      { limit }
    | _ -> failwith "ListReq.of_wire: expected JSON array"
end

module IdReq = struct
  type t = {
    id : int;
  }

  let make ~id () =
    { id }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      { id }
    | _ -> failwith "IdReq.of_wire: expected JSON array"
end

module TokenReq = struct
  type t = {
    token : string;
  }

  let make ~token () =
    { token }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `String v.token;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let token = (match (_g 0) with `String s -> s | _ -> "") in
      { token }
    | _ -> failwith "TokenReq.of_wire: expected JSON array"
end

module ApiKeyReq = struct
  type t = {
    api_key : string;
  }

  let make ~api_key () =
    { api_key }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `String v.api_key;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let api_key = (match (_g 0) with `String s -> s | _ -> "") in
      { api_key }
    | _ -> failwith "ApiKeyReq.of_wire: expected JSON array"
end

module CreateReq = struct
  type t = {
    name : string;
  }

  let make ~name () =
    { name }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `String v.name;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let name = (match (_g 0) with `String s -> s | _ -> "") in
      { name }
    | _ -> failwith "CreateReq.of_wire: expected JSON array"
end

module Ok = struct
  type t = {
    ok : bool;
  }

  let make ~ok () =
    { ok }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Bool v.ok;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let ok = (match (_g 0) with `Bool b -> b | _ -> false) in
      { ok }
    | _ -> failwith "Ok.of_wire: expected JSON array"
end

module ProjectList = struct
  type t = {
    projects : Project.t list;
  }

  let make ~projects () =
    { projects }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `List (List.map (fun item -> Project.to_wire item) v.projects);
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let projects = (match (_g 0) with `List items -> List.map (fun item -> Project.of_wire item) items | _ -> []) in
      { projects }
    | _ -> failwith "ProjectList.of_wire: expected JSON array"
end

let _service_ref : (string -> Yojson.Safe.t -> Yojson.Safe.t -> Yojson.Safe.t) option ref = ref None

module type IMPL = sig
  type state
  val init : unit -> state
  val list : state -> Well.rpc_ctx -> ListReq.t -> ProjectList.t
  val get : state -> Well.rpc_ctx -> IdReq.t -> Project.t
  val get_by_token : state -> Well.rpc_ctx -> TokenReq.t -> Project.t
  val get_by_api_key : state -> Well.rpc_ctx -> ApiKeyReq.t -> Project.t
  val create : state -> Well.rpc_ctx -> CreateReq.t -> Project.t
  val delete : state -> Well.rpc_ctx -> IdReq.t -> Ok.t
end

let make_spec (type s) (module I : IMPL with type state = s) : Well.Service.spec =
  let state = ref (I.init ()) in
  { name = "ProjectAccess"
  ; rpcs = [
      { Well.Service.rname = "list"
      ; params = [{ Well.Service.pname = "limit"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "projects"; ptype = "Project list"; poptional = false }]
      ; returns_name = "ProjectList" };
      { Well.Service.rname = "get"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "token"; ptype = "string"; poptional = false }; { Well.Service.pname = "api_key"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Project" };
      { Well.Service.rname = "get_by_token"
      ; params = [{ Well.Service.pname = "token"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "token"; ptype = "string"; poptional = false }; { Well.Service.pname = "api_key"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Project" };
      { Well.Service.rname = "get_by_api_key"
      ; params = [{ Well.Service.pname = "api_key"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "token"; ptype = "string"; poptional = false }; { Well.Service.pname = "api_key"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Project" };
      { Well.Service.rname = "create"
      ; params = [{ Well.Service.pname = "name"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "token"; ptype = "string"; poptional = false }; { Well.Service.pname = "api_key"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Project" };
      { Well.Service.rname = "delete"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "ok"; ptype = "bool"; poptional = false }]
      ; returns_name = "Ok" };
    ]
  ; handler = (fun rpc_name ctx_json payload ->
      let ctx = Well.rpc_ctx_of_wire ctx_json in
      match rpc_name with
      | "list" ->
          ProjectList.to_wire (I.list !state ctx (ListReq.of_wire payload))
      | "get" ->
          Project.to_wire (I.get !state ctx (IdReq.of_wire payload))
      | "get_by_token" ->
          Project.to_wire (I.get_by_token !state ctx (TokenReq.of_wire payload))
      | "get_by_api_key" ->
          Project.to_wire (I.get_by_api_key !state ctx (ApiKeyReq.of_wire payload))
      | "create" ->
          Project.to_wire (I.create !state ctx (CreateReq.of_wire payload))
      | "delete" ->
          Ok.to_wire (I.delete !state ctx (IdReq.of_wire payload))
      | _ -> failwith ("Unknown RPC: " ^ rpc_name))
  ; set_ref = (fun f -> _service_ref := Some f)
  }

let list ~ctx ~limit =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = ListReq.to_wire (ListReq.make ~limit ()) in
  ProjectList.of_wire
    ((match !_service_ref with
      | Some f -> f "list" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

let get ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Project.of_wire
    ((match !_service_ref with
      | Some f -> f "get" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

let get_by_token ~ctx ~token =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = TokenReq.to_wire (TokenReq.make ~token ()) in
  Project.of_wire
    ((match !_service_ref with
      | Some f -> f "get_by_token" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

let get_by_api_key ~ctx ~api_key =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = ApiKeyReq.to_wire (ApiKeyReq.make ~api_key ()) in
  Project.of_wire
    ((match !_service_ref with
      | Some f -> f "get_by_api_key" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

let create ~ctx ~name =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = CreateReq.to_wire (CreateReq.make ~name ()) in
  Project.of_wire
    ((match !_service_ref with
      | Some f -> f "create" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

let delete ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Ok.of_wire
    ((match !_service_ref with
      | Some f -> f "delete" ctx_wire wire
      | None -> failwith "ProjectAccess: service not registered"))

