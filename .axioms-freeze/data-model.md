# Model danych

## Aksjomaty

### Tabele

#### Tabela projects
[test]
Tabela `projects` przechowuje projekty: id (int, PK auto), name (string), token (string, 8 znaków, unikalny), api_key (string, 32 znaki hex, unikalny), created_at (string ISO 8601 UTC), user_id (int, FK do tabeli users Well.Auth). Token generowany losowo przy tworzeniu. API key generowany losowo przy tworzeniu. Orphan projects (user_id=0) przypisywane do seed usera przy starcie.

#### Tabela mocks
[test]
Tabela `mocks` przechowuje metadane moków: id (int, PK auto), project_id (int, FK do projects), name (string), slug (string, generowany z name), status (string: "draft"|"review"|"approved"|"rejected", domyślnie "draft"), entry_file (string, domyślny plik HTML), created_at (string ISO 8601 UTC), updated_at (string ISO 8601 UTC).

#### Tabela mock_files
Tabela `mock_files` rejestruje pliki mocka: id (int, PK auto), mock_id (int, FK do mocks), path (string, ścieżka względna pliku), content_type (string MIME), size (int, rozmiar w bajtach). Sama zawartość plików na S3, nie w bazie.

#### Tabela comments
[test]
Tabela `comments` przechowuje komentarze: id (int, PK auto), mock_id (int, FK do mocks), page_path (string, ścieżka strony w mocku), x_pct (float, pozycja X jako % szerokości, -1 = brak pina), y_pct (float, pozycja Y jako % wysokości, -1 = brak pina), author_name (string, imię autora), body (string, treść), resolved (int, 0=aktywny 1=rozwiązany), created_at (string ISO 8601 UTC).

### Kontrakty serwisów

#### Kontrakt ProjectAccess
[test]
Serwis ProjectAccess (lib/contract/ProjectAccess.toml) definiuje 7 operacji RPC: list (ListReq→ProjectList), list_by_user (UserReq→ProjectList), get (IdReq→Project), get_by_token (TokenReq→Project), get_by_api_key (ApiKeyReq→Project), create (CreateReq→Project), delete (IdReq→Ok). Struktury: Project (id, name, token, api_key, created_at, user_id), ListReq (limit), IdReq (id), TokenReq (token), ApiKeyReq (api_key), UserReq (user_id), CreateReq (name, user_id), ProjectList (projects: list of Project), Ok (ok: bool).

#### Kontrakt MockAccess
[test]
Serwis MockAccess (lib/contract/MockAccess.toml) definiuje 8 operacji RPC: list_by_project (ProjectReq→MockList), get (IdReq→Mock), get_by_slug (SlugReq→Mock), create (CreateReq→Mock), update_status (StatusReq→Mock), delete (IdReq→Ok), add_file (AddFileReq→MockFile), list_files (IdReq→MockFileList). Struktury: Mock (id, project_id, name, slug, status, entry_file, created_at, updated_at), MockFile (id, mock_id, path, content_type, size), plus struktury request/response.

#### Kontrakt CommentAccess
[test]
Serwis CommentAccess (lib/contract/CommentAccess.toml) definiuje 4 operacje RPC: list_by_mock (MockReq→CommentList), create (CreateReq→Comment), resolve (IdReq→Comment), delete (IdReq→Ok). Struktury: Comment (id, mock_id, page_path, x_pct, y_pct, author_name, body, resolved: bool, created_at), plus struktury request/response.

### Generowanie identyfikatorów

#### Generowanie tokenu projektu
[test]
Token projektu to 8 losowych znaków z zestawu `abcdefghijklmnopqrstuvwxyz0123456789`. Generowany przez Random.int.

#### Generowanie API key
[test]
API key to 32-znakowy hex string. Generowany przez pętlę 32 razy `Printf.sprintf "%x" (Random.int 16)`.

#### Generowanie slugów
[test]
Slug generowany z nazwy: litery → lowercase, cyfry i myślnik bez zmian, spacje/podkreślniki/kropki → myślnik, inne znaki usuwane, wielokrotne myślniki → jeden, myślniki na początku/końcu usuwane. Pusty wynik → "untitled".
