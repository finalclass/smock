(* Template processor — handles {{layout: file}}, named blocks and yields *)
(* Layout: {{yield blockname}} — placeholder for named block *)
(* Page: {{blockname}}...{{/blockname}} — defines content for a named block *)

type file_map = (string * string) list

let find_file (files : file_map) path =
  let normalized = String.trim path in
  let normalized = if String.length normalized > 0 && normalized.[0] = '/' then
    String.sub normalized 1 (String.length normalized - 1) else normalized in
  match List.assoc_opt normalized files with
  | Some content -> content
  | None ->
    match List.assoc_opt path files with
    | Some content -> content
    | None -> failwith ("Template file not found: " ^ path)

let find_substr haystack needle start =
  let nlen = String.length needle in
  let hlen = String.length haystack in
  let rec search i =
    if i + nlen > hlen then None
    else if String.sub haystack i nlen = needle then Some i
    else search (i + 1)
  in
  search start

let extract_layout_ref html =
  match find_substr html "{{layout:" 0 with
  | None -> None
  | Some start ->
    match find_substr html "}}" (start + 9) with
    | None -> None
    | Some stop ->
      let path = String.sub html (start + 9) (stop - start - 9) in
      Some (String.trim path)

(* Extract all named blocks: {{name}}...{{/name}} *)
let extract_blocks html =
  let blocks = ref [] in
  let pos = ref 0 in
  let len = String.length html in
  while !pos < len do
    match find_substr html "{{" !pos with
    | None -> pos := len
    | Some start ->
      if start + 2 < len && html.[start + 2] = '/' then
        (* closing tag, skip *)
        (match find_substr html "}}" (start + 2) with
         | Some stop -> pos := stop + 2
         | None -> pos := len)
      else if start + 2 < len && (
        (* skip {{layout:...}} and {{yield ...}} *)
        (start + 9 <= len && String.sub html start 9 = "{{layout:")
        || (start + 8 <= len && String.sub html start 8 = "{{yield "))
      then
        (match find_substr html "}}" (start + 2) with
         | Some stop -> pos := stop + 2
         | None -> pos := len)
      else
        (match find_substr html "}}" (start + 2) with
         | None -> pos := len
         | Some name_end ->
           let name = String.trim (String.sub html (start + 2) (name_end - start - 2)) in
           if name <> "" && not (String.contains name ' ') then begin
             let close_tag = "{{/" ^ name ^ "}}" in
             let body_start = name_end + 2 in
             match find_substr html close_tag body_start with
             | Some close_pos ->
               let body = String.sub html body_start (close_pos - body_start) in
               blocks := (name, body) :: !blocks;
               pos := close_pos + String.length close_tag
             | None -> pos := name_end + 2
           end else
             pos := name_end + 2)
  done;
  List.rev !blocks

(* Replace all {{yield name}} with corresponding block content *)
let replace_yields layout blocks =
  let result = ref layout in
  let changed = ref true in
  while !changed do
    changed := false;
    match find_substr !result "{{yield " 0 with
    | None -> ()
    | Some start ->
      (match find_substr !result "}}" (start + 8) with
       | None -> ()
       | Some stop ->
         let name = String.trim (String.sub !result (start + 8) (stop - start - 8)) in
         let replacement = match List.assoc_opt name blocks with
           | Some body -> body
           | None -> ""
         in
         let before = String.sub !result 0 start in
         let after_pos = stop + 2 in
         let after = String.sub !result after_pos (String.length !result - after_pos) in
         result := before ^ replacement ^ after;
         changed := true)
  done;
  !result

let process (files : file_map) : file_map =
  List.map (fun (path, content) ->
    let processed =
      match extract_layout_ref content with
      | None -> content
      | Some layout_path ->
        let layout_content = find_file files layout_path in
        let blocks = extract_blocks content in
        replace_yields layout_content blocks
    in
    (path, processed)
  ) files
