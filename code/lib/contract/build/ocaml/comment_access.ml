[@@@warning "-32"]

module Comment = struct
  type t = {
    id : int;
    thread_id : int;
    author_name : string;
    body : string;
    created_at : string;
  }

  let make ~id ~thread_id ~author_name ~body ~created_at () =
    { id; thread_id; author_name; body; created_at }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `Int v.thread_id;
      `String v.author_name;
      `String v.body;
      `String v.created_at;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let thread_id = (match (_g 1) with `Int i -> i | _ -> 0) in
      let author_name = (match (_g 2) with `String s -> s | _ -> "") in
      let body = (match (_g 3) with `String s -> s | _ -> "") in
      let created_at = (match (_g 4) with `String s -> s | _ -> "") in
      { id; thread_id; author_name; body; created_at }
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

module CreateThreadReq = struct
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
    | _ -> failwith "CreateThreadReq.of_wire: expected JSON array"
end

module AddCommentReq = struct
  type t = {
    thread_id : int;
    author_name : string;
    body : string;
  }

  let make ~thread_id ~author_name ~body () =
    { thread_id; author_name; body }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.thread_id;
      `String v.author_name;
      `String v.body;
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let thread_id = (match (_g 0) with `Int i -> i | _ -> 0) in
      let author_name = (match (_g 1) with `String s -> s | _ -> "") in
      let body = (match (_g 2) with `String s -> s | _ -> "") in
      { thread_id; author_name; body }
    | _ -> failwith "AddCommentReq.of_wire: expected JSON array"
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

module Thread = struct
  type t = {
    id : int;
    mock_id : int;
    page_path : string;
    x_pct : float;
    y_pct : float;
    resolved : bool;
    created_at : string;
    comments : Comment.t list;
  }

  let make ~id ~mock_id ~page_path ~x_pct ~y_pct ~resolved ~created_at ~comments () =
    { id; mock_id; page_path; x_pct; y_pct; resolved; created_at; comments }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `Int v.id;
      `Int v.mock_id;
      `String v.page_path;
      `Float v.x_pct;
      `Float v.y_pct;
      `Bool v.resolved;
      `String v.created_at;
      `List (List.map (fun item -> Comment.to_wire item) v.comments);
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
      let resolved = (match (_g 5) with `Bool b -> b | _ -> false) in
      let created_at = (match (_g 6) with `String s -> s | _ -> "") in
      let comments = (match (_g 7) with `List items -> List.map (fun item -> Comment.of_wire item) items | _ -> []) in
      { id; mock_id; page_path; x_pct; y_pct; resolved; created_at; comments }
    | _ -> failwith "Thread.of_wire: expected JSON array"
end

module ThreadList = struct
  type t = {
    threads : Thread.t list;
  }

  let make ~threads () =
    { threads }

  let to_wire (v : t) : Yojson.Safe.t =
    `List [
      `List (List.map (fun item -> Thread.to_wire item) v.threads);
    ]

  let of_wire (wire : Yojson.Safe.t) : t =
    match wire with
    | `List arr ->
      let a = Array.of_list arr in
      let _g i = if i < Array.length a then a.(i) else `Null in
      let threads = (match (_g 0) with `List items -> List.map (fun item -> Thread.of_wire item) items | _ -> []) in
      { threads }
    | _ -> failwith "ThreadList.of_wire: expected JSON array"
end

let _service_ref : (string -> Yojson.Safe.t -> Yojson.Safe.t -> Yojson.Safe.t) option ref = ref None

module type IMPL = sig
  type state
  val init : unit -> state
  val list_threads_by_mock : state -> Well.rpc_ctx -> MockReq.t -> ThreadList.t
  val create_thread : state -> Well.rpc_ctx -> CreateThreadReq.t -> Thread.t
  val add_comment : state -> Well.rpc_ctx -> AddCommentReq.t -> Comment.t
  val resolve_thread : state -> Well.rpc_ctx -> IdReq.t -> Thread.t
  val delete_thread : state -> Well.rpc_ctx -> IdReq.t -> Ok.t
end

let make_spec (type s) (module I : IMPL with type state = s) : Well.Service.spec =
  let state = ref (I.init ()) in
  { name = "CommentAccess"
  ; rpcs = [
      { Well.Service.rname = "list_threads_by_mock"
      ; params = [{ Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "threads"; ptype = "Thread list"; poptional = false }]
      ; returns_name = "ThreadList" };
      { Well.Service.rname = "create_thread"
      ; params = [{ Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "resolved"; ptype = "bool"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "comments"; ptype = "Comment list"; poptional = false }]
      ; returns_name = "Thread" };
      { Well.Service.rname = "add_comment"
      ; params = [{ Well.Service.pname = "thread_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "thread_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "author_name"; ptype = "string"; poptional = false }; { Well.Service.pname = "body"; ptype = "string"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }]
      ; returns_name = "Comment" };
      { Well.Service.rname = "resolve_thread"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }; { Well.Service.pname = "mock_id"; ptype = "int"; poptional = false }; { Well.Service.pname = "page_path"; ptype = "string"; poptional = false }; { Well.Service.pname = "x_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "y_pct"; ptype = "float"; poptional = false }; { Well.Service.pname = "resolved"; ptype = "bool"; poptional = false }; { Well.Service.pname = "created_at"; ptype = "string"; poptional = false }; { Well.Service.pname = "comments"; ptype = "Comment list"; poptional = false }]
      ; returns_name = "Thread" };
      { Well.Service.rname = "delete_thread"
      ; params = [{ Well.Service.pname = "id"; ptype = "int"; poptional = false }]
      ; returns = [{ Well.Service.pname = "ok"; ptype = "bool"; poptional = false }]
      ; returns_name = "Ok" };
    ]
  ; handler = (fun rpc_name ctx_json payload ->
      let ctx = Well.rpc_ctx_of_wire ctx_json in
      match rpc_name with
      | "list_threads_by_mock" ->
          ThreadList.to_wire (I.list_threads_by_mock !state ctx (MockReq.of_wire payload))
      | "create_thread" ->
          Thread.to_wire (I.create_thread !state ctx (CreateThreadReq.of_wire payload))
      | "add_comment" ->
          Comment.to_wire (I.add_comment !state ctx (AddCommentReq.of_wire payload))
      | "resolve_thread" ->
          Thread.to_wire (I.resolve_thread !state ctx (IdReq.of_wire payload))
      | "delete_thread" ->
          Ok.to_wire (I.delete_thread !state ctx (IdReq.of_wire payload))
      | _ -> failwith ("Unknown RPC: " ^ rpc_name))
  ; set_ref = (fun f -> _service_ref := Some f)
  }

let list_threads_by_mock ~ctx ~mock_id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = MockReq.to_wire (MockReq.make ~mock_id ()) in
  ThreadList.of_wire
    ((match !_service_ref with
      | Some f -> f "list_threads_by_mock" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let create_thread ~ctx ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = CreateThreadReq.to_wire (CreateThreadReq.make ~mock_id ~page_path ~x_pct ~y_pct ~author_name ~body ()) in
  Thread.of_wire
    ((match !_service_ref with
      | Some f -> f "create_thread" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let add_comment ~ctx ~thread_id ~author_name ~body =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = AddCommentReq.to_wire (AddCommentReq.make ~thread_id ~author_name ~body ()) in
  Comment.of_wire
    ((match !_service_ref with
      | Some f -> f "add_comment" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let resolve_thread ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Thread.of_wire
    ((match !_service_ref with
      | Some f -> f "resolve_thread" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

let delete_thread ~ctx ~id =
  let ctx_wire = Well.rpc_ctx_to_wire ctx in
  let wire = IdReq.to_wire (IdReq.make ~id ()) in
  Ok.of_wire
    ((match !_service_ref with
      | Some f -> f "delete_thread" ctx_wire wire
      | None -> failwith "CommentAccess: service not registered"))

