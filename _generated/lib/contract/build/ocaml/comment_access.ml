[@@@warning "-32"]

module Comment = struct
  type t = {
    id : int;
    mock_id : int;
    page_path : string;
    x_pct : float;
    y_pct : float;
    author_name : string;
    body : string;
    resolved : bool;
    created_at : string;
  }

  let make ~id ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body ~resolved ~created_at () =
    { id; mock_id; page_path; x_pct; y_pct; author_name; body; resolved; created_at }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `Int v.mock_id;
      `String v.page_path;
      `Float v.x_pct;
      `Float v.y_pct;
      `String v.author_name;
      `String v.body;
      `Bool v.resolved;
      `String v.created_at;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let mock_id = (match (_g 1) with `Int i -> i | _ -> 0) in
      let page_path = (match (_g 2) with `String s -> s | _ -> "") in
      let x_pct = (match (_g 3) with `Float f -> f | `Int i -> float_of_int i | _ -> 0.0) in
      let y_pct = (match (_g 4) with `Float f -> f | `Int i -> float_of_int i | _ -> 0.0) in
      let author_name = (match (_g 5) with `String s -> s | _ -> "") in
      let body = (match (_g 6) with `String s -> s | _ -> "") in
      let resolved = (match (_g 7) with `Bool b -> b | _ -> false) in
      let created_at = (match (_g 8) with `String s -> s | _ -> "") in
      { id; mock_id; page_path; x_pct; y_pct; author_name; body; resolved; created_at }
    | _ -> failwith "Comment.of_wire: expected JSON array"
end

module MockReq = struct
  type t = {
    mock_id : int;
  }

  let make ~mock_id () =
    { mock_id }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.mock_id;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let mock_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      { mock_id }
    | _ -> failwith "MockReq.of_wire: expected JSON array"
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

module CreateReq = struct
  type t = {
    mock_id : int;
    page_path : string;
    x_pct : float;
    y_pct : float;
    author_name : string;
    body : string;
  }

  let make ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body () =
    { mock_id; page_path; x_pct; y_pct; author_name; body }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.mock_id;
      `String v.page_path;
      `Float v.x_pct;
      `Float v.y_pct;
      `String v.author_name;
      `String v.body;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let mock_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let page_path = (match (_g 1) with `String s -> s | _ -> "") in
      let x_pct = (match (_g 2) with `Float f -> f | `Int i -> float_of_int i | _ -> 0.0) in
      let y_pct = (match (_g 3) with `Float f -> f | `Int i -> float_of_int i | _ -> 0.0) in
      let author_name = (match (_g 4) with `String s -> s | _ -> "") in
      let body = (match (_g 5) with `String s -> s | _ -> "") in
      { mock_id; page_path; x_pct; y_pct; author_name; body }
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

module CommentList = struct
  type t = {
    comments : Comment.t list;
  }

  let make ~comments () =
    { comments }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `List (List.map (fun item -> Comment.to_wire item) v.comments);
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let comments = (match (_g 0) with `List items -> List.map (fun item -> Comment.of_wire item) items | _ -> []) in
      { comments }
    | _ -> failwith "CommentList.of_wire: expected JSON array"
end

let _service_ref : (string -> Yojson.Safe.t -> Yojson.Safe.t -> Yojson.Safe.t) option ref = ref None

module type IMPL = sig
  type state
  val init : unit -> state
  val list_by_mock : state -> Well.rpc_ctx -> MockReq.t -> CommentList.t
  val create : state -> Well.rpc_ctx -> CreateReq.t -> Comment.t
  val resolve : state -> Well.rpc_ctx -> IdReq.t -> Comment.t
  val delete : state -> Well.rpc_ctx -> IdReq.t -> Ok.t
end

let make_spec (type s) (module I : IMPL with type state = s) : Well.Service.spec =
  let state = ref (I.init ()) in
  { name = "CommentAccess"
  ; rpcs = [
      { Well.Service.rname = "list_by_mock"
      ; params = [{ Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "comments"; ptype = "Comment list"; poptional = false }]
      ; returns_name = "CommentList" };
      { Well.Service.rname = "create"
      ; params = [{ Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }; { Well.Service.pname = "resolved"; ptype = "bool"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Comment" };
      { Well.Service.rname = "resolve"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }; { Well.Service.pname = "resolved"; ptype = "bool"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Comment" };
      { Well.Service.rname = "delete"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "ok"; ptype = "bool"; poptional = false }]
      ; returns_name = "Ok" };
    ]
  ; handler = (fun rpc_name ctx_json payload ->
      let ctx = Well.rpc_ctx_of_wire ctx_json in
      match rpc_name with
      | "list_by_mock" ->
          CommentList.to_wire (I.list_by_mock !state ctx (MockReq.of_wire payload))
      | "create" ->
          Comment.to_wire (I.create !state ctx (CreateReq.of_wire payload))
      | "resolve" ->
          Comment.to_wire (I.resolve !state ctx (IdReq.of_wire payload))
      | "delete" ->
          Ok.to_wire (I.delete !state ctx (IdReq.of_wire payload))
      | _ -> failwith ("Unknown RPC: " ^ rpc_name))
  ; set_ref = (fun f -> _service_ref := Some f)
  }

let list_by_mock ~ctx ~mock_id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = MockReq.to_wire (MockReq.make ~mock_id ()) in
  CommentList.of_wire
    ((match !_service_ref with
      | Some f -> f "list_by_mock" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let create ~ctx ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = CreateReq.to_wire (CreateReq.make ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body ()) in
  Comment.of_wire
    ((match !_service_ref with
      | Some f -> f "create" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let resolve ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Comment.of_wire
    ((match !_service_ref with
      | Some f -> f "resolve" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let delete ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Ok.of_wire
    ((match !_service_ref with
      | Some f -> f "delete" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

