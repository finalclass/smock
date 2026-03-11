(* @axiom: mocks.md#przechowywanie-plików-na-s3 *)
let s3 = lazy (Well.S3.connect ())
let get_s3 () = Lazy.force s3

let sanitize_path path =
  let parts = String.split_on_char '/' path in
  let safe_parts = List.filter (fun p -> p <> ".." && p <> "." && p <> "") parts in
  String.concat "/" safe_parts

let s3_key ~project_id ~mock_id path =
  let safe_path = sanitize_path path in
  Printf.sprintf "mocks/%d/%d/%s" project_id mock_id safe_path

let content_type_of_ext path =
  let ext = Filename.extension path |> String.lowercase_ascii in
  match ext with
  | ".html" | ".htm" -> "text/html"
  | ".css" -> "text/css"
  | ".js" -> "application/javascript"
  | ".json" -> "application/json"
  | ".png" -> "image/png"
  | ".jpg" | ".jpeg" -> "image/jpeg"
  | ".gif" -> "image/gif"
  | ".svg" -> "image/svg+xml"
  | ".webp" -> "image/webp"
  | ".ico" -> "image/x-icon"
  | ".woff" -> "font/woff"
  | ".woff2" -> "font/woff2"
  | ".ttf" -> "font/ttf"
  | ".eot" -> "application/vnd.ms-fontobject"
  | ".pdf" -> "application/pdf"
  | ".xml" -> "application/xml"
  | ".txt" -> "text/plain"
  | ".map" -> "application/json"
  | _ -> "application/octet-stream"

let local_dir = "data/mock_files"

let local_path ~project_id ~mock_id path =
  let safe_path = sanitize_path path in
  Printf.sprintf "%s/%d/%d/%s" local_dir project_id mock_id safe_path

let use_local () =
  match Sys.getenv_opt "STORAGE" with
  | Some "s3" -> false
  | _ ->
    match Sys.getenv_opt "PRODUCTION" with
    | Some "true" -> false
    | _ -> true

let ensure_dir path =
  let dir = Filename.dirname path in
  let rec mkdir_p d =
    if not (Sys.file_exists d) then begin
      mkdir_p (Filename.dirname d);
      (try Sys.mkdir d 0o755 with Sys_error _ -> ())
    end
  in
  mkdir_p dir

let store_file ~project_id ~mock_id ~path ~data =
  if use_local () then begin
    let lp = local_path ~project_id ~mock_id path in
    ensure_dir lp;
    let oc = open_out_bin lp in
    output_string oc data;
    close_out oc
  end else begin
    let s3 = get_s3 () in
    let key = s3_key ~project_id ~mock_id path in
    let ct = content_type_of_ext path in
    match Well.S3.put s3 ~key ~content_type:ct data with
    | Ok () -> ()
    | Error e -> failwith ("S3 put error: " ^ e)
  end

let get_file ~project_id ~mock_id ~path =
  if use_local () then begin
    let lp = local_path ~project_id ~mock_id path in
    if Sys.file_exists lp then begin
      let ic = open_in_bin lp in
      let n = in_channel_length ic in
      let data = Bytes.create n in
      really_input ic data 0 n;
      close_in ic;
      Some (Bytes.to_string data)
    end else None
  end else begin
    let s3 = get_s3 () in
    let key = s3_key ~project_id ~mock_id path in
    match Well.S3.get s3 ~key with
    | Ok data -> Some data
    | Error _ -> None
  end

let delete_mock_files ~project_id ~mock_id (paths : string list) =
  if use_local () then
    List.iter (fun path ->
      let lp = local_path ~project_id ~mock_id path in
      if Sys.file_exists lp then Sys.remove lp
    ) paths
  else begin
    let s3 = get_s3 () in
    List.iter (fun path ->
      let key = s3_key ~project_id ~mock_id path in
      ignore (Well.S3.delete s3 ~key)
    ) paths
  end
(* /@axiom: mocks.md#przechowywanie-plików-na-s3 *)
