(* @axiom: mocks.md#workflow-uploadu-mocka *)
let upload_mock ~ctx ~project_id ~name ~(files : (string * string) list) =
  if String.trim name = "" then failwith "Name cannot be empty";
  if files = [] then failwith "No files provided";
  let slug = Slug.generate name in
  (* Determine entry file: first html file, or first file *)
  let entry_file =
    let html_files = List.filter (fun (p, _) ->
      let ext = Filename.extension p in
      (ext = ".html" || ext = ".htm") && Filename.basename p <> "layout.html"
    ) files in
    match List.find_opt (fun (p, _) -> Filename.basename p = "index.html") html_files with
    | Some (p, _) -> p
    | None ->
      match html_files with
      | (p, _) :: _ -> p
      | [] -> fst (List.hd files)
  in
  (* Create mock record *)
  let mock = Mock_access.create ~ctx ~project_id ~name ~slug ~entry_file in
  (* Process templates *)
  let processed = Template_processor.process files in
  (* Store files on S3 and register in DB *)
  List.iter (fun (path, data) ->
    let ct = S3_storage.content_type_of_ext path in
    let size = String.length data in
    S3_storage.store_file ~project_id ~mock_id:mock.id ~path ~data;
    ignore (Mock_access.add_file ~ctx ~mock_id:mock.id ~path ~content_type:ct ~size)
  ) processed;
  Well.publish Events.mock_event (`MockUploaded (mock.id, mock.name));
  mock
(* /@axiom: mocks.md#workflow-uploadu-mocka *)

(* @axiom: mocks.md#zmiana-statusu-mocka *)
let update_status ~ctx ~mock_id ~status =
  let valid = ["draft"; "review"; "approved"; "rejected"] in
  if not (List.mem status valid) then
    failwith ("Invalid status: " ^ status ^ ". Must be one of: " ^ String.concat ", " valid);
  let mock = Mock_access.update_status ~ctx ~id:mock_id ~status in
  Well.publish Events.mock_event (`MockStatusChanged (mock.id, status));
  mock
(* /@axiom: mocks.md#zmiana-statusu-mocka *)

let rename_mock ~ctx ~mock_id ~name =
  let trimmed = String.trim name in
  if trimmed = "" then failwith "Name cannot be empty";
  let mock = Mock_access.rename ~ctx ~id:mock_id ~name:trimmed in
  Well.publish Events.mock_event (`MockRenamed (mock.id, mock.name));
  mock

(* @axiom: mocks.md#kasowanie-mocka-z-s3 *)
let delete_mock ~ctx ~mock_id =
  let mock = Mock_access.get ~ctx ~id:mock_id in
  let files_result = Mock_access.list_files ~ctx ~id:mock_id in
  let paths = List.map (fun (f : Mock_access.MockFile.t) -> f.path) files_result.files in
  S3_storage.delete_mock_files ~project_id:mock.project_id ~mock_id paths;
  Mock_access.delete ~ctx ~id:mock_id
(* /@axiom: mocks.md#kasowanie-mocka-z-s3 *)

(* @axiom: mock-builder.md#endpoint-aktualizacji-plików-mocka *)
let upload_files ~ctx ~project_id ~mock_id ~(files : (string * string) list) =
  if files = [] then failwith "No files provided";
  let mock = Mock_access.get ~ctx ~id:mock_id in
  if mock.project_id <> project_id then failwith "Access denied";
  (* Delete old files from S3 *)
  let old_files = Mock_access.list_files ~ctx ~id:mock_id in
  let old_paths = List.map (fun (f : Mock_access.MockFile.t) -> f.path) old_files.files in
  S3_storage.delete_mock_files ~project_id ~mock_id old_paths;
  (* Delete old mock_files DB records *)
  Mock_access_impl.clear_files ~mock_id;
  (* Process templates *)
  let processed = Template_processor.process files in
  (* Determine entry file *)
  let entry_file =
    let html_files = List.filter (fun (p, _) ->
      let ext = Filename.extension p in
      (ext = ".html" || ext = ".htm") && Filename.basename p <> "layout.html"
    ) processed in
    match List.find_opt (fun (p, _) -> Filename.basename p = "index.html") html_files with
    | Some (p, _) -> p
    | None ->
      match html_files with
      | (p, _) :: _ -> p
      | [] -> fst (List.hd processed)
  in
  (* Store new files on S3 + register in DB *)
  List.iter (fun (path, data) ->
    let ct = S3_storage.content_type_of_ext path in
    let size = String.length data in
    S3_storage.store_file ~project_id ~mock_id ~path ~data;
    ignore (Mock_access.add_file ~ctx ~mock_id ~path ~content_type:ct ~size)
  ) processed;
  Well.publish Events.mock_event (`MockUploaded (mock_id, mock.name));
  (mock, entry_file, List.length processed)
(* /@axiom: mock-builder.md#endpoint-aktualizacji-plików-mocka *)
