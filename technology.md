# Technologia

## Aksjomaty

### Stack technologiczny

#### OCaml i Well framework
Aplikacja jest napisana w OCaml z użyciem frameworka Well. Well dostarcza: routing HTTP, LiveView (real-time UI), middleware, sesje, CSRF, szablony MLX (JSX-like), kontrakty serwisów (TOML → generowane moduły), pub/sub eventy, S3 storage, Auth (rejestracja/logowanie/sesje), rate limiting, statyczne pliki.

#### SQLite jako baza danych
Metadane (projekty, moki, pliki moków, komentarze) przechowywane w SQLite. Well.Db.open_db() otwiera bazę. Zapytania definiowane przez `let%query`. Tabele tworzone przez `[@@deriving table]`.

#### S3 jako storage plików
Pliki moków (HTML/CSS/JS/obrazki) przechowywane na S3 (Hetzner Object Storage). Klucze S3: `mocks/{project_id}/{mock_id}/{path}`. Well.S3 dostarcza operacje put/get/delete.

#### TypeScript do JavaScript
Pliki `.ts` w `static/ts/` kompilowane do `.js` przez Bun przy `dune build`. Nigdy nie edytujemy plików `.js` bezpośrednio.

#### Deploy jako pojedyncza binarka
`well release` tworzy archiwum tar.gz. Deploy na serwer przez SCP + systemd. Domena: smock.finalclass.net. W produkcji HTTPS automatycznie przez Well.

#### Kontrakty serwisów w TOML
Serwisy definiowane przez pliki `.toml` w `lib/contract/`. `well contract build .` generuje moduły OCaml, TypeScript, Go i Dart. Kontrakty definiują RPC (request → response) i struktury danych (msg).

#### MLX — szablony jak JSX
Strony i widoki pisane w plikach `.mlx` — OCaml z wbudowanym HTML (jak JSX). Elementy HTML używają `class_`, `type_`, `name_` (z podkreślnikiem) zamiast rezerwowanych słów OCaml.

#### System budowania Dune
Dune zarządza kompilacją OCaml i TS→JS. `dune build` kompiluje wszystko. `dune test` uruchamia testy. `dune exec -w bin/main.exe` — tryb deweloperski z hot-reload.

#### Architektura IDesign
System zdekomponowany według IDesign (Juval Lowy): Manager → Engine → Access → Resource. Proporcje: 2 Managers, 1 Engine, 4 Access. Zamknięta architektura warstwowa — każda warstwa komunikuje się tylko z warstwą bezpośrednio poniżej.
