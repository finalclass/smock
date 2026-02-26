open Well_test

let () =
  describe "smock" (fun () ->
    it "template processor — no layout" (fun () ->
      let files = [("index.html", "<h1>Hello</h1>")] in
      let result = Template_processor.process files in
      expect (List.assoc "index.html" result) |> to_equal_string "<h1>Hello</h1>"
    );

    it "template processor — with layout" (fun () ->
      let files = [
        ("layout.html", "<html>{{yield}}</html>");
        ("page.html", "{{layout: layout.html}}{{content}}<h1>Hi</h1>{{/content}}")
      ] in
      let result = Template_processor.process files in
      expect (List.assoc "page.html" result) |> to_equal_string "<html><h1>Hi</h1></html>"
    );

    it "slug generation" (fun () ->
      expect (Slug.generate "Hello World") |> to_equal_string "hello-world";
      expect (Slug.generate "My--Cool  Page") |> to_equal_string "my-cool-page";
    );

    it "s3 content type detection" (fun () ->
      expect (S3_storage.content_type_of_ext "style.css") |> to_equal_string "text/css";
      expect (S3_storage.content_type_of_ext "index.html") |> to_equal_string "text/html";
      expect (S3_storage.content_type_of_ext "app.js") |> to_equal_string "application/javascript";
      expect (S3_storage.content_type_of_ext "image.png") |> to_equal_string "image/png";
      expect (S3_storage.content_type_of_ext "unknown.xyz") |> to_equal_string "application/octet-stream";
    );
  );
  run ~source_file:__FILE__ () |> exit_with_result
