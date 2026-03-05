# API

## Aksjomaty

### Endpointy API

#### POST /api/projects — tworzenie projektu
[security]
Wymaga Bearer api_key. Tworzy nowy projekt z podaną nazwą (JSON body: {"name": "..."}). user_id dziedziczony z projektu znalezionego przez api_key. Zwraca JSON: id, name, token, api_key, created_at.

#### GET /api/projects — lista projektów
[security]
Wymaga Bearer api_key. Zwraca projekty należące do usera (user_id z projektu api_key). JSON: {"projects": [...]} z id, name, token, created_at (bez api_key w liście).

#### POST /api/projects/:token/mocks — upload mocka
[security]
Wymaga Bearer api_key. Multipart form-data z polem "name" i plikami. Sprawdza, czy user_id projektu :token zgadza się z user_id projektu api_key. Wywołuje MockManager.upload_mock. Zwraca JSON: id, name, slug, status, entry_file, url (ścieżka /p/:token/:slug).

#### GET /api/projects/:token/mocks — lista moków
[security]
Wymaga Bearer api_key. Zwraca moki projektu :token. Sprawdza ownership. JSON: {"mocks": [...]} z id, name, slug, status, entry_file, created_at, updated_at.

#### PUT /api/projects/:token/mocks/:id — zmiana statusu
[security]
Wymaga Bearer api_key. JSON body: {"status": "review|approved|rejected|draft"}. Sprawdza ownership. Wywołuje MockManager.update_status. Zwraca JSON: id, status, updated_at.

#### DELETE /api/projects/:token/mocks/:id — usunięcie mocka
[security]
Wymaga Bearer api_key. Sprawdza ownership. Wywołuje MockManager.delete_mock. Zwraca JSON: {"ok": true}.

### Middleware API

#### Rate limiting
Rate limit: 60 requestów na 10 sekund (Well.rate_limit). Aplikowany globalnie do wszystkich endpointów.

#### CSRF selektywne
CSRF middleware (Well.csrf) aplikowany do wszystkich requestów OPRÓCZ ścieżek zaczynających się od "/api" (sprawdzenie: 4 pierwsze znaki ścieżki = "/api").
