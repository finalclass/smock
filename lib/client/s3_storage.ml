(* S3 storage — mock file operations *)

let s3 = lazy (Well.S3.connect ())
let get_s3 () = Lazy.force s3

let s3_key ~project_id ~mock_id path =
  Printf.sprintf "mocks/%d/%d/%s" project_id mock_id path

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

let store_file ~project_id ~mock_id ~path ~data =
  let s3 = get_s3 () in
  let key = s3_key ~project_id ~mock_id path in
  let ct = content_type_of_ext path in
  match Well.S3.put s3 ~key ~content_type:ct data with
  | Ok () -> ()
  | Error e -> failwith ("S3 put error: " ^ e)

let get_file ~project_id ~mock_id ~path =
  let s3 = get_s3 () in
  let key = s3_key ~project_id ~mock_id path in
  match Well.S3.get s3 ~key with
  | Ok data -> Some data
  | Error _ -> None

let delete_mock_files ~project_id ~mock_id (paths : string list) =
  let s3 = get_s3 () in
  List.iter (fun path ->
    let key = s3_key ~project_id ~mock_id path in
    ignore (Well.S3.delete s3 ~key)
  ) paths
