# API

## Aksjomaty

### Endpointy API — zarządzanie projektami i mokami

#### POST /api/projects — tworzenie projektu
[pentest]
Wymaga Bearer api_key. Tworzy nowy projekt z podaną nazwą (JSON body: {"name": "..."}). user_id dziedziczony z projektu znalezionego przez api_key. Zwraca JSON: id, name, token, api_key, created_at.

#### GET /api/projects — lista projektów
[pentest]
Wymaga Bearer api_key. Zwraca projekty należące do usera (user_id z projektu api_key). JSON: {"projects": [...]} z id, name, token, created_at (bez api_key w liście).

#### POST /api/projects/:token/mocks — upload mocka
[pentest]
Wymaga Bearer api_key. Multipart form-data z polem "name" i plikami. Sprawdza, czy user_id projektu :token zgadza się z user_id projektu api_key. Wywołuje MockManager.upload_mock. Zwraca JSON: id, name, slug, status, entry_file, url (ścieżka /p/:token/:slug).

#### GET /api/projects/:token/mocks — lista moków
[pentest]
Wymaga Bearer api_key. Zwraca moki projektu :token. Sprawdza ownership. JSON: {"mocks": [...]} z id, name, slug, status, entry_file, created_at, updated_at.

#### PUT /api/projects/:token/mocks/:id — zmiana statusu
[pentest]
Wymaga Bearer api_key. JSON body: {"status": "review|approved|rejected|draft"}. Sprawdza ownership. Wywołuje MockManager.update_status. Zwraca JSON: id, status, updated_at.

#### DELETE /api/projects/:token/mocks/:id — usunięcie mocka
[pentest]
Wymaga Bearer api_key. Sprawdza ownership. Wywołuje MockManager.delete_mock. Zwraca JSON: {"ok": true}.

### API feedbacku — kontrakty RPC

Dostęp do wątków i komentarzy dla skilli AI odbywa się przez kontrakty RPC wystawione przez `Well.Service.expose "CommentAccess"`. Endpointy automatycznie dostępne pod `/rpc/CommentAccess/*`.

#### Odczyt feedbacku
[pentest]
`POST /rpc/CommentAccess/list_threads_by_mock` z JSON `{"mock_id": N}`. Zwraca listę wątków z komentarzami. Skill AI używa tego do czytania feedbacku klienta. Opcja: filtr `resolved=false` aby pobrać tylko otwarte wątki.

#### Resolve wątku po poprawce
[pentest]
`POST /rpc/CommentAccess/resolve_thread` z JSON `{"id": N}`. Skill AI po poprawieniu UI oznacza wątek jako rozwiązany.

#### Odpowiedź w wątku
[pentest]
`POST /rpc/CommentAccess/add_comment` z JSON `{"thread_id": N, "author_name": "AI", "body": "Poprawione..."}`. Skill AI informuje klienta o wprowadzonych zmianach.

#### Autoryzacja RPC
Endpointy RPC wymagają Bearer api_key (ten sam middleware co reszta API). Handler weryfikuje ownership: mock_id → project → user_id musi zgadzać się z user_id projektu api_key.

### Komentarze klienckie — Channels

Komponent `<smock-comments>` w widoku klienckim komunikuje się wyłącznie przez Well Channel `comments:{mock_id}` (WebSocket). Brak endpointów HTTP dla komentarzy klienckich. Szczegóły w [System komentarzy](./comments.md).

### Middleware API

#### Rate limiting
Rate limit: 60 requestów na 10 sekund (Well.rate_limit). Aplikowany globalnie do wszystkich endpointów.

#### CSRF selektywne
CSRF middleware (Well.csrf) aplikowany do wszystkich requestów OPRÓCZ ścieżek zaczynających się od "/api" i "/rpc".
