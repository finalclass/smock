(* @axiom: infrastructure.md#eventy--definicje-typów *)
type comment_event =
  [ `CommentAdded of int * int
  | `CommentResolved of int * int
  | `CommentDeleted of int * int ]
[@@deriving yojson, topic]

type mock_event =
  [ `MockUploaded of int * string
  | `MockStatusChanged of int * string ]
[@@deriving yojson, topic]
(* /@axiom: infrastructure.md#eventy--definicje-typów *)
