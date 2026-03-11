(* @axiom: infrastructure.md#punkt-wejścia-aplikacji *)
let () =
  Mirage_crypto_rng_unix.use_default () ;
  App.run ()
(* /@axiom: infrastructure.md#punkt-wejścia-aplikacji *)
