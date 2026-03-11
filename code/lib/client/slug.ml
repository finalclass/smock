(* @axiom: data-model.md#generowanie-slugów *)
let transliterate c =
  match c with
  | 'a'..'z' | '0'..'9' | '-' -> String.make 1 c
  | 'A'..'Z' -> String.make 1 (Char.lowercase_ascii c)
  | ' ' | '_' | '.' -> "-"
  | _ -> ""

let generate name =
  let buf = Buffer.create (String.length name) in
  String.iter (fun c -> Buffer.add_string buf (transliterate c)) name;
  let s = Buffer.contents buf in
  (* collapse multiple dashes *)
  let rec collapse acc i prev_dash =
    if i >= String.length s then Buffer.contents acc
    else
      let c = s.[i] in
      if c = '-' then begin
        if not prev_dash then Buffer.add_char acc '-';
        collapse acc (i + 1) true
      end else begin
        Buffer.add_char acc c;
        collapse acc (i + 1) false
      end
  in
  let result = collapse (Buffer.create (String.length s)) 0 false in
  (* trim leading/trailing dashes *)
  let len = String.length result in
  let start = if len > 0 && result.[0] = '-' then 1 else 0 in
  let stop = if len > 0 && result.[len - 1] = '-' then len - 1 else len in
  if stop > start then String.sub result start (stop - start)
  else "untitled"
(* /@axiom: data-model.md#generowanie-slugów *)
