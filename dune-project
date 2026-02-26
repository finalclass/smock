(lang dune 3.17)

(dialect
 (name mlx)
 (implementation
  (extension mlx)
  (merlin_reader mlx)
  (preprocess
   (run mlx-pp %{input-file}))))

(pin
 (url "file:///home/sel/Documents/well")
 (package (name well)))

(package
 (name smock)
 (allow_empty)
 (synopsis "A well web application")
 (depends
  (ocaml (>= 5.4))
  mlx
  well
  eio
  eio_main
  yojson
  sqlite3
  ppx_deriving_yojson))
