(* @axiom: comments.md#kanał-commentsmockid *)
type comment_event =
  [ `ThreadCreated of int * int
  | `CommentAdded of int * int
  | `ThreadResolved of int * int
  | `ThreadDeleted of int * int ]
[@@deriving yojson, topic]

type mock_event =
  [ `MockUploaded of int * string
  | `MockStatusChanged of int * string
  | `MockRenamed of int * string ]
[@@deriving yojson, topic]
(* /@axiom: comments.md#kanał-commentsmockid *)
