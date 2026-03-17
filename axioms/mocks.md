# Zarządzanie mokami

## Aksjomaty

### Upload moków

#### Workflow uploadu mocka
[test]
Upload mocka (MockManager.upload_mock): (1) walidacja — nazwa niepusta, lista plików niepusta, (2) generowanie sluga z nazwy, (3) wyznaczenie entry_file — priorytet: index.html > pierwszy HTML (nie layout.html) > pierwszy plik, (4) tworzenie rekordu mocka w bazie (status: "draft"), (5) przetwarzanie szablonów (Template_processor.process), (6) zapis każdego przetworzonego pliku na S3 + rejestracja w mock_files, (7) publikacja eventu MockUploaded.

#### Template processing — system layoutów
[test]
Procesor szablonów (Template_processor) przetwarza pliki jednorazowo przy uploadzie. Mechanizm: plik strony deklaruje `{{layout: plik_layoutu.html}}`, definiuje bloki `{{nazwa}}...{{/nazwa}}`. Layout zawiera `{{yield nazwa}}` jako placeholder. Procesor podmienia yield na odpowiedni blok. Plik bez deklaracji layoutu — bez zmian. Layouty mogą mieć wiele nazwanych bloków. Wyszukiwanie pliku normalizuje ścieżki (usuwa wiodący slash).

### Status moków

#### Zmiana statusu mocka
[test]
Status mocka może być zmieniony na: "draft", "review", "approved", "rejected". Próba ustawienia innego statusu → failwith. Po zmianie statusu aktualizuje updated_at i publikuje event MockStatusChanged. Zmiana możliwa przez panel admina (POST /projects/:id/mocks/:mock_id/status) lub API (PUT /api/projects/:token/mocks/:id).

#### Widoczność moków
Moki ze statusem "draft" są widoczne tylko w panelu admina. Widok kliencki filtruje: `m.status <> "draft"`. Moki w statusie "review", "approved" i "rejected" są widoczne dla klientów.

### Usunięcie mocka

#### Kasowanie mocka z S3
[test]
Usunięcie mocka (MockManager.delete_mock): (1) pobiera mock z bazy, (2) pobiera listę plików, (3) kasuje pliki z S3 (S3_storage.delete_mock_files), (4) kasuje rekordy mock_files, (5) kasuje rekord mocka.

### Storage S3

#### Przechowywanie plików na S3
[test]
Pliki moków przechowywane na S3 pod kluczem `mocks/{project_id}/{mock_id}/{path}`. S3_storage.store_file zapisuje dane z odpowiednim Content-Type. S3_storage.get_file pobiera dane. S3_storage.delete_mock_files kasuje listę plików. Content-Type wykrywany z rozszerzenia: .html→text/html, .css→text/css, .js→application/javascript, .json→application/json, .png→image/png, .jpg/.jpeg→image/jpeg, .gif→image/gif, .svg→image/svg+xml, .webp→image/webp, .ico→image/x-icon, .woff→font/woff, .woff2→font/woff2, .ttf→font/ttf, .eot→application/vnd.ms-fontobject, .pdf→application/pdf, .xml→application/xml, .txt→text/plain, .map→application/json, reszta→application/octet-stream.

### Serwowanie plików

#### Serwowanie plików mocka klientowi
Endpoint GET /p/:token/:mock_slug/f/*path serwuje pliki mocka z S3. Rozwiązuje projekt po tokenie, mock po slugu, pobiera plik z S3. Ustawia Content-Type na podstawie rozszerzenia i Cache-Control: public, max-age=3600. Zwraca 404 jeśli plik nie istnieje.

### Implementacja MockAccess

#### MockAccess — warstwa dostępu do SQLite
[test]
Implementacja MockAccess (mock_access_impl.ml) używa `[@@deriving table]` dla tabel mocks i mock_files. Moduł Impl implementuje Mock_access.IMPL. Operacje: list_by_project (SELECT ORDER BY id DESC), get (SELECT WHERE id), get_by_slug (SELECT WHERE project_id AND slug), create (INSERT z timestampem, ai_session_id domyślnie ""), update_status (UPDATE SET status, updated_at), set_ai_session (UPDATE SET ai_session_id WHERE id), delete (DELETE mock_files + DELETE mock), add_file (INSERT do mock_files), list_files (SELECT WHERE mock_id ORDER BY path).
