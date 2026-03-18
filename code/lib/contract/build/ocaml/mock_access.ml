[@@@warning "-32"]

module Mock = struct
  type t = {
    id : int;
    project_id : int;
    name : string;
    slug : string;
    status : string;
    entry_file : string;
    ai_session_id : string;
    created_at : string;
    updated_at : string;
  }

  let make ~id ~project_id ~name ~slug ~status ~entry_file ~ai_session_id ~created_at ~updated_at () =
    { id; project_id; name; slug; status; entry_file; ai_session_id; created_at; updated_at }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `Int v.project_id;
      `String v.name;
      `String v.slug;
      `String v.status;
      `String v.entry_file;
      `String v.ai_session_id;
      `String v.created_at;
      `String v.updated_at;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let project_id = (match (_g 1) with `Int i -> i | _ -> 0) in
      let name = (match (_g 2) with `String s -> s | _ -> "") in
      let slug = (match (_g 3) with `String s -> s | _ -> "") in
      let status = (match (_g 4) with `String s -> s | _ -> "") in
      let entry_file = (match (_g 5) with `String s -> s | _ -> "") in
      let ai_session_id = (match (_g 6) with `String s -> s | _ -> "") in
      let created_at = (match (_g 7) with `String s -> s | _ -> "") in
      let updated_at = (match (_g 8) with `String s -> s | _ -> "") in
      { id; project_id; name; slug; status; entry_file; ai_session_id; created_at; updated_at }
    | _ -> failwith "Mock.of_wire: expected JSON array"
end

module MockFile = struct
  type t = {
    id : int;
    mock_id : int;
    path : string;
    content_type : string;
    size : int;
  }

  let make ~id ~mock_id ~path ~content_type ~size () =
    { id; mock_id; path; content_type; size }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `Int v.mock_id;
      `String v.path;
      `String v.content_type;
      `Int v.size;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let mock_id = (match (_g 1) with `Int i -> i | _ -> 0) in
      let path = (match (_g 2) with `String s -> s | _ -> "") in
      let content_type = (match (_g 3) with `String s -> s | _ -> "") in
      let size = (match (_g 4) with `Int i -> i | _ -> 0) in
      { id; mock_id; path; content_type; size }
    | _ -> failwith "MockFile.of_wire: expected JSON array"
end

module ProjectReq = struct
  type t = {
    project_id : int;
  }

  let make ~project_id () =
    { project_id }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.project_id;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let project_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      { project_id }
    | _ -> failwith "ProjectReq.of_wire: expected JSON array"
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

module SlugReq = struct
  type t = {
    project_id : int;
    slug : string;
  }

  let make ~project_id ~slug () =
    { project_id; slug }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.project_id;
      `String v.slug;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let project_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let slug = (match (_g 1) with `String s -> s | _ -> "") in
      { project_id; slug }
    | _ -> failwith "SlugReq.of_wire: expected JSON array"
end

module CreateReq = struct
  type t = {
    project_id : int;
    name : string;
    slug : string;
    entry_file : string;
  }

  let make ~project_id ~name ~slug ~entry_file () =
    { project_id; name; slug; entry_file }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.project_id;
      `String v.name;
      `String v.slug;
      `String v.entry_file;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let project_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let name = (match (_g 1) with `String s -> s | _ -> "") in
      let slug = (match (_g 2) with `String s -> s | _ -> "") in
      let entry_file = (match (_g 3) with `String s -> s | _ -> "") in
      { project_id; name; slug; entry_file }
    | _ -> failwith "CreateReq.of_wire: expected JSON array"
end

module StatusReq = struct
  type t = {
    id : int;
    status : string;
  }

  let make ~id ~status () =
    { id; status }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `String v.status;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let status = (match (_g 1) with `String s -> s | _ -> "") in
      { id; status }
    | _ -> failwith "StatusReq.of_wire: expected JSON array"
end

module RenameReq = struct
  type t = {
    id : int;
    name : string;
  }

  let make ~id ~name () =
    { id; name }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `String v.name;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let name = (match (_g 1) with `String s -> s | _ -> "") in
      { id; name }
    | _ -> failwith "RenameReq.of_wire: expected JSON array"
end

module SetAiSessionReq = struct
  type t = { id : int; ai_session_id : string; }
  let make ~id ~ai_session_id () = { id; ai_session_id }
  let to_wire (v : t) : Yojson.Safe.t = `List [ `Int v.id; `String v.ai_session_id; ]
  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let ai_session_id = (match (_g 1) with `String s -> s | _ -> "") in
      { id; ai_session_id }
    | _ -> failwith "SetAiSessionReq.of_wire: expected JSON array"
end

module AddFileReq = struct
  type t = {
    mock_id : int;
    path : string;
    content_type : string;
    size : int;
  }

  let make ~mock_id ~path ~content_type ~size () =
    { mock_id; path; content_type; size }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.mock_id;
      `String v.path;
      `String v.content_type;
      `Int v.size;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let mock_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let path = (match (_g 1) with `String s -> s | _ -> "") in
      let content_type = (match (_g 2) with `String s -> s | _ -> "") in
      let size = (match (_g 3) with `Int i -> i | _ -> 0) in
      { mock_id; path; content_type; size }
    | _ -> failwith "AddFileReq.of_wire: expected JSON array"
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

module MockList = struct
  type t = {
    mocks : Mock.t list;
  }

  let make ~mocks () =
    { mocks }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `List (List.map (fun item -> Mock.to_wire item) v.mocks);
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let mocks = (match (_g 0) with `List items -> List.map (fun item -> Mock.of_wire item) items | _ -> []) in
      { mocks }
    | _ -> failwith "MockList.of_wire: expected JSON array"
end

module MockFileList = struct
  type t = {
    files : MockFile.t list;
  }

  let make ~files () =
    { files }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `List (List.map (fun item -> MockFile.to_wire item) v.files);
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let files = (match (_g 0) with `List items -> List.map (fun item -> MockFile.of_wire item) items | _ -> []) in
      { files }
    | _ -> failwith "MockFileList.of_wire: expected JSON array"
end

let _service_ref : (string -> Yojson.Safe.t -> Yojson.Safe.t -> Yojson.Safe.t) option ref = ref None

module type IMPL = sig
  type state
  val init : unit -> state
  val list_by_project : state -> Well.rpc_ctx -> ProjectReq.t -> MockList.t
  val get : state -> Well.rpc_ctx -> IdReq.t -> Mock.t
  val get_by_slug : state -> Well.rpc_ctx -> SlugReq.t -> Mock.t
  val create : state -> Well.rpc_ctx -> CreateReq.t -> Mock.t
  val update_status : state -> Well.rpc_ctx -> StatusReq.t -> Mock.t
  val rename : state -> Well.rpc_ctx -> RenameReq.t -> Mock.t
  val set_ai_session : state -> Well.rpc_ctx -> SetAiSessionReq.t -> Mock.t
  val delete : state -> Well.rpc_ctx -> IdReq.t -> Ok.t
  val add_file : state -> Well.rpc_ctx -> AddFileReq.t -> MockFile.t
  val list_files : state -> Well.rpc_ctx -> IdReq.t -> MockFileList.t
end

let make_spec (type s) (module I : IMPL with type state = s) : Well.Service.spec =
  let state = ref (I.init ()) in
  { name = "MockAccess"
  ; rpcs = [
      { Well.Service.rname = "list_by_project"
      ; params = [{ Well.Service.pname = "project_id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "mocks"; ptype = "Mock list"; poptional = false }]
      ; returns_name = "MockList" };
      { Well.Service.rname = "get"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "get_by_slug"
      ; params = [{ Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "create"
      ; params = [{ Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "update_status"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "rename"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "set_ai_session"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "project_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "name"; ptype = "string"; poptional = false }; { Well.Service.pname = "slug"; ptype = "string"; poptional = false }; { Well.Service.pname = "status"; ptype = "string"; poptional = false }; { Well.Service.pname = "entry_file"; ptype = "string"; poptional = false }; { Well.Service.pname = "ai_session_id"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "updated_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Mock" };
      { Well.Service.rname = "delete"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "ok"; ptype = "bool"; poptional = false }]
      ; returns_name = "Ok" };
      { Well.Service.rname = "add_file"
      ; params = [{ Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "path"; ptype = "string"; poptional = false }; { Well.Service.pname = "content_type"; ptype = "string"; poptional = false }; { Well.Service.pname = "size"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "path"; ptype = "string"; poptional = false }; { Well.Service.pname = "content_type"; ptype = "string"; poptional = false }; { Well.Service.pname = "size"; ptype = "int"; poptional = false }]
      ; returns_name = "MockFile" };
      { Well.Service.rname = "list_files"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "files"; ptype = "MockFile list"; poptional = false }]
      ; returns_name = "MockFileList" };
    ]
  ; handler = (fun rpc_name ctx_json payload ->
      let ctx = Well.rpc_ctx_of_wire ctx_json in
      match rpc_name with
      | "list_by_project" ->
          MockList.to_wire (I.list_by_project !state ctx (ProjectReq.of_wire payload))
      | "get" ->
          Mock.to_wire (I.get !state ctx (IdReq.of_wire payload))
      | "get_by_slug" ->
          Mock.to_wire (I.get_by_slug !state ctx (SlugReq.of_wire payload))
      | "create" ->
          Mock.to_wire (I.create !state ctx (CreateReq.of_wire payload))
      | "update_status" ->
          Mock.to_wire (I.update_status !state ctx (StatusReq.of_wire payload))
      | "rename" ->
          Mock.to_wire (I.rename !state ctx (RenameReq.of_wire payload))
      | "set_ai_session" -> Mock.to_wire (I.set_ai_session !state ctx (SetAiSessionReq.of_wire payload))
      | "delete" ->
          Ok.to_wire (I.delete !state ctx (IdReq.of_wire payload))
      | "add_file" ->
          MockFile.to_wire (I.add_file !state ctx (AddFileReq.of_wire payload))
      | "list_files" ->
          MockFileList.to_wire (I.list_files !state ctx (IdReq.of_wire payload))
      | _ -> failwith ("Unknown RPC: " ^ rpc_name))
  ; set_ref = (fun f -> _service_ref := Some f)
  }

let list_by_project ~ctx ~project_id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = ProjectReq.to_wire (ProjectReq.make ~project_id ()) in
  MockList.of_wire
    ((match !_service_ref with
      | Some f -> f "list_by_project" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let get ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "get" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let get_by_slug ~ctx ~project_id ~slug =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = SlugReq.to_wire (SlugReq.make ~project_id ~slug ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "get_by_slug" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let create ~ctx ~project_id ~name ~slug ~entry_file =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = CreateReq.to_wire (CreateReq.make ~project_id ~name ~slug ~entry_file ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "create" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let update_status ~ctx ~id ~status =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = StatusReq.to_wire (StatusReq.make ~id ~status ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "update_status" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let rename ~ctx ~id ~name =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = RenameReq.to_wire (RenameReq.make ~id ~name ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "rename" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let set_ai_session ~ctx ~id ~ai_session_id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = SetAiSessionReq.to_wire (SetAiSessionReq.make ~id ~ai_session_id ()) in
  Mock.of_wire
    ((match !_service_ref with
      | Some f -> f "set_ai_session" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let delete ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Ok.of_wire
    ((match !_service_ref with
      | Some f -> f "delete" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let add_file ~ctx ~mock_id ~path ~content_type ~size =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = AddFileReq.to_wire (AddFileReq.make ~mock_id ~path ~content_type ~size ()) in
  MockFile.of_wire
    ((match !_service_ref with
      | Some f -> f "add_file" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

let list_files ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  MockFileList.of_wire
    ((match !_service_ref with
      | Some f -> f "list_files" ctx_wire wire
      | None -> failwith "MockAccess: service not registered"))

