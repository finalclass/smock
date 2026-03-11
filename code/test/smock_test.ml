open Well_test

let test_ctx () : Well.rpc_ctx =
  { session_id = "test-session"
  ; request_id = "test-request"
  ; user_id = None
  ; user_name = None
  ; locale = "en" }

let register_for_test (spec : Well.Service.spec) =
  spec.set_ref spec.handler

let setup_services () =
  Well.Db.data_dir := "/tmp/smock_test_data";
  register_for_test Project_access_impl.spec;
  register_for_test Mock_access_impl.spec;
  register_for_test Comment_access_impl.spec

let () =
  describe "smock" (fun () ->

    describe "template processor" (fun () ->
      it "no layout — passes through unchanged" (fun () ->
        let files = [("index.html", "<h1>Hello</h1>")] in
        let result = Template_processor.process files in
        expect (List.assoc "index.html" result) |> to_equal_string "<h1>Hello</h1>"
      );

      it "with layout — substitutes yield with block content" (fun () ->
        let files = [
          ("layout.html", "<html>{{yield content}}</html>");
          ("page.html", "{{layout: layout.html}}{{content}}<h1>Hi</h1>{{/content}}")
        ] in
        let result = Template_processor.process files in
        expect (List.assoc "page.html" result) |> to_equal_string "<html><h1>Hi</h1></html>"
      );

      it "multiple named blocks" (fun () ->
        let files = [
          ("layout.html", "<head>{{yield head}}</head><body>{{yield body}}</body>");
          ("page.html", "{{layout: layout.html}}{{head}}<title>T</title>{{/head}}{{body}}<p>B</p>{{/body}}")
        ] in
        let result = Template_processor.process files in
        expect (List.assoc "page.html" result) |> to_equal_string "<head><title>T</title></head><body><p>B</p></body>"
      );

      it "normalizes leading slash in layout path" (fun () ->
        let files = [
          ("layout.html", "<div>{{yield content}}</div>");
          ("page.html", "{{layout: /layout.html}}{{content}}OK{{/content}}")
        ] in
        let result = Template_processor.process files in
        expect (List.assoc "page.html" result) |> to_equal_string "<div>OK</div>"
      );
    );

    describe "slug generation" (fun () ->
      it "converts spaces to dashes and lowercases" (fun () ->
        expect (Slug.generate "Hello World") |> to_equal_string "hello-world"
      );

      it "collapses multiple dashes" (fun () ->
        expect (Slug.generate "My--Cool  Page") |> to_equal_string "my-cool-page"
      );

      it "removes special characters" (fun () ->
        expect (Slug.generate "Hello! @World#") |> to_equal_string "hello-world"
      );

      it "trims leading and trailing dashes" (fun () ->
        expect (Slug.generate " -test- ") |> to_equal_string "test"
      );

      it "returns untitled for empty input" (fun () ->
        expect (Slug.generate "") |> to_equal_string "untitled";
        expect (Slug.generate "!!!") |> to_equal_string "untitled"
      );

      it "handles dots and underscores" (fun () ->
        expect (Slug.generate "file.name_test") |> to_equal_string "file-name-test"
      );
    );

    describe "token generation" (fun () ->
      it "generates 8-character lowercase alphanumeric token" (fun () ->
        let token = Project_access_impl.gen_token () in
        expect (String.length token) |> to_equal_int 8;
        let valid_chars = "abcdefghijklmnopqrstuvwxyz0123456789" in
        String.iter (fun c ->
          expect (String.contains valid_chars c) |> to_be_true
        ) token
      );

      it "generates different tokens on repeated calls" (fun () ->
        let t1 = Project_access_impl.gen_token () in
        let t2 = Project_access_impl.gen_token () in
        let t3 = Project_access_impl.gen_token () in
        (* At least 2 of 3 should be different — collision chance is ~1/2.8 trillion *)
        expect (t1 <> t2 || t2 <> t3) |> to_be_true
      );
    );

    describe "api key generation" (fun () ->
      it "generates 32-character hex string" (fun () ->
        let key = Project_access_impl.gen_api_key () in
        expect (String.length key) |> to_equal_int 32;
        let hex_chars = "0123456789abcdef" in
        String.iter (fun c ->
          expect (String.contains hex_chars c) |> to_be_true
        ) key
      );

      it "generates different keys on repeated calls" (fun () ->
        let k1 = Project_access_impl.gen_api_key () in
        let k2 = Project_access_impl.gen_api_key () in
        expect (k1 <> k2) |> to_be_true
      );
    );

    describe "s3 content type detection" (fun () ->
      it "detects common web types" (fun () ->
        expect (S3_storage.content_type_of_ext "style.css") |> to_equal_string "text/css";
        expect (S3_storage.content_type_of_ext "index.html") |> to_equal_string "text/html";
        expect (S3_storage.content_type_of_ext "app.js") |> to_equal_string "application/javascript";
        expect (S3_storage.content_type_of_ext "data.json") |> to_equal_string "application/json"
      );

      it "detects image types" (fun () ->
        expect (S3_storage.content_type_of_ext "image.png") |> to_equal_string "image/png";
        expect (S3_storage.content_type_of_ext "photo.jpg") |> to_equal_string "image/jpeg";
        expect (S3_storage.content_type_of_ext "photo.jpeg") |> to_equal_string "image/jpeg";
        expect (S3_storage.content_type_of_ext "icon.svg") |> to_equal_string "image/svg+xml";
        expect (S3_storage.content_type_of_ext "pic.webp") |> to_equal_string "image/webp";
        expect (S3_storage.content_type_of_ext "icon.gif") |> to_equal_string "image/gif";
        expect (S3_storage.content_type_of_ext "fav.ico") |> to_equal_string "image/x-icon"
      );

      it "detects font types" (fun () ->
        expect (S3_storage.content_type_of_ext "f.woff") |> to_equal_string "font/woff";
        expect (S3_storage.content_type_of_ext "f.woff2") |> to_equal_string "font/woff2";
        expect (S3_storage.content_type_of_ext "f.ttf") |> to_equal_string "font/ttf";
        expect (S3_storage.content_type_of_ext "f.eot") |> to_equal_string "application/vnd.ms-fontobject"
      );

      it "falls back to octet-stream for unknown types" (fun () ->
        expect (S3_storage.content_type_of_ext "unknown.xyz") |> to_equal_string "application/octet-stream"
      );

      it "detects map files as json" (fun () ->
        expect (S3_storage.content_type_of_ext "app.js.map") |> to_equal_string "application/json"
      );
    );

    describe "mock status validation" (fun () ->
      it "rejects invalid status" (fun () ->
        let raised = ref false in
        (try ignore (Mock_manager_impl.update_status ~ctx:(Obj.magic ()) ~mock_id:0 ~status:"invalid")
         with Failure msg ->
           raised := true;
           expect (String.length msg > 0) |> to_be_true);
        expect !raised |> to_be_true
      );
    );

    describe "ProjectAccess integration" (fun () ->
      it "creates and retrieves a project" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let project = Project_access.create ~ctx ~name:"Test Project" ~user_id:1 in
        expect (project.name) |> to_equal_string "Test Project";
        expect (project.user_id) |> to_equal_int 1;
        expect (String.length project.token) |> to_equal_int 8;
        expect (String.length project.api_key) |> to_equal_int 32;
        (* Get by id *)
        let found = Project_access.get ~ctx ~id:project.id in
        expect (found.name) |> to_equal_string "Test Project";
        (* Get by token *)
        let found2 = Project_access.get_by_token ~ctx ~token:project.token in
        expect (found2.id) |> to_equal_int project.id;
        (* Get by api_key *)
        let found3 = Project_access.get_by_api_key ~ctx ~api_key:project.api_key in
        expect (found3.id) |> to_equal_int project.id;
        (* List by user *)
        let result = Project_access.list_by_user ~ctx ~user_id:1 in
        expect (List.length result.projects > 0) |> to_be_true;
        (* Delete *)
        let ok = Project_access.delete ~ctx ~id:project.id in
        expect ok.ok |> to_be_true
      );
    );

    describe "MockAccess integration" (fun () ->
      it "creates and manages mocks" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let project = Project_access.create ~ctx ~name:"Mock Test" ~user_id:1 in
        (* Create mock *)
        let mock = Mock_access.create ~ctx ~project_id:project.id ~name:"Landing" ~slug:"landing" ~entry_file:"index.html" in
        expect (mock.name) |> to_equal_string "Landing";
        expect (mock.status) |> to_equal_string "draft";
        expect (mock.slug) |> to_equal_string "landing";
        (* Get by id *)
        let found = Mock_access.get ~ctx ~id:mock.id in
        expect (found.name) |> to_equal_string "Landing";
        (* Get by slug *)
        let found2 = Mock_access.get_by_slug ~ctx ~project_id:project.id ~slug:"landing" in
        expect (found2.id) |> to_equal_int mock.id;
        (* List by project *)
        let result = Mock_access.list_by_project ~ctx ~project_id:project.id in
        expect (List.length result.mocks) |> to_equal_int 1;
        (* Update status *)
        let updated = Mock_access.update_status ~ctx ~id:mock.id ~status:"review" in
        expect (updated.status) |> to_equal_string "review";
        (* Add file *)
        let file = Mock_access.add_file ~ctx ~mock_id:mock.id ~path:"index.html" ~content_type:"text/html" ~size:100 in
        expect (file.path) |> to_equal_string "index.html";
        (* List files *)
        let files = Mock_access.list_files ~ctx ~id:mock.id in
        expect (List.length files.files) |> to_equal_int 1;
        (* Delete *)
        let ok = Mock_access.delete ~ctx ~id:mock.id in
        expect ok.ok |> to_be_true;
        ignore (Project_access.delete ~ctx ~id:project.id)
      );
    );

    (* @axiom: comment-access.md#commentaccess *)
    describe "CommentAccess integration" (fun () ->
      it "creates a thread with first comment" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let thread = Comment_access.create_thread ~ctx ~mock_id:999
          ~page_path:"index.html" ~x_pct:50.0 ~y_pct:30.0
          ~author_name:"Tester" ~body:"Looks good" in
        expect (thread.mock_id) |> to_equal_int 999;
        expect (thread.page_path) |> to_equal_string "index.html";
        expect (thread.resolved) |> to_be_false;
        expect (List.length thread.comments) |> to_equal_int 1;
        let c = List.hd thread.comments in
        expect (c.author_name) |> to_equal_string "Tester";
        expect (c.body) |> to_equal_string "Looks good";
        expect (c.thread_id) |> to_equal_int thread.id
      );

      it "adds a reply comment to a thread" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let thread = Comment_access.create_thread ~ctx ~mock_id:998
          ~page_path:"page.html" ~x_pct:10.0 ~y_pct:20.0
          ~author_name:"Alice" ~body:"First post" in
        let comment = Comment_access.add_comment ~ctx ~thread_id:thread.id
          ~author_name:"Bob" ~body:"I agree" in
        expect (comment.author_name) |> to_equal_string "Bob";
        expect (comment.body) |> to_equal_string "I agree";
        expect (comment.thread_id) |> to_equal_int thread.id
      );

      it "lists threads with nested comments" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let thread = Comment_access.create_thread ~ctx ~mock_id:997
          ~page_path:"index.html" ~x_pct:50.0 ~y_pct:50.0
          ~author_name:"Alice" ~body:"Hello" in
        ignore (Comment_access.add_comment ~ctx ~thread_id:thread.id
          ~author_name:"Bob" ~body:"Reply 1");
        ignore (Comment_access.add_comment ~ctx ~thread_id:thread.id
          ~author_name:"Carol" ~body:"Reply 2");
        let result = Comment_access.list_threads_by_mock ~ctx ~mock_id:997 in
        expect (List.length result.threads > 0) |> to_be_true;
        let found = List.find (fun (t : Comment_access.Thread.t) -> t.id = thread.id) result.threads in
        expect (List.length found.comments) |> to_equal_int 3
      );

      it "resolves a thread" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let thread = Comment_access.create_thread ~ctx ~mock_id:996
          ~page_path:"index.html" ~x_pct:25.0 ~y_pct:75.0
          ~author_name:"Tester" ~body:"Fix this" in
        let resolved = Comment_access.resolve_thread ~ctx ~id:thread.id in
        expect (resolved.resolved) |> to_be_true;
        expect (resolved.id) |> to_equal_int thread.id
      );

      it "deletes a thread and its comments" (fun () ->
        setup_services ();
        let ctx = test_ctx () in
        let thread = Comment_access.create_thread ~ctx ~mock_id:995
          ~page_path:"index.html" ~x_pct:60.0 ~y_pct:40.0
          ~author_name:"Tester" ~body:"Delete me" in
        ignore (Comment_access.add_comment ~ctx ~thread_id:thread.id
          ~author_name:"Bob" ~body:"Also delete");
        let ok = Comment_access.delete_thread ~ctx ~id:thread.id in
        expect ok.ok |> to_be_true;
        let result = Comment_access.list_threads_by_mock ~ctx ~mock_id:995 in
        let found = List.filter (fun (t : Comment_access.Thread.t) -> t.id = thread.id) result.threads in
        expect (List.length found) |> to_equal_int 0
      );
    );
    (* /@axiom: comment-access.md#commentaccess *)
  );
  run ~source_file:__FILE__ () |> exit_with_result
