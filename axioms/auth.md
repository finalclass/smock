# Autentykacja i autoryzacja

## Aksjomaty

### Autentykacja admina

#### Logowanie i rejestracja
[pentest]
Panel admina wymaga logowania. Well.Auth dostarcza register (email + password → user), login (email + password → session), logout (clear session). Strona logowania: GET /login, POST /login. Strona rejestracji: GET /register, POST /register. Hasła potwierdzane (password_confirm musi być równe password). Po rejestracji automatyczne logowanie. Niezalogowany użytkownik przekierowany na /login (middleware auth_error_handler łapie Auth_denied).

#### Sesje i CSRF
[pentest]
Sesje zarządzane przez Well (cookie). CSRF wymagany dla wszystkich POST/PUT/DELETE (oprócz /api/*). CSRF token wstawiany w formularzach przez csrf_input. Middleware: Well.csrf aplikowany selektywnie (nie do /api/* ścieżek).

### Autoryzacja API

#### Bearer token API
[pentest]
Endpointy /api/* wymagają nagłówka `Authorization: Bearer <api_key>`. Middleware require_api_key: wyciąga Bearer token z headera, szuka projektu po api_key w bazie. Zwraca 401 JSON jeśli brak headera lub nieprawidłowy klucz. Projekt znaleziony przez api_key przechowywany w kontekście request (ProjectCtx) — dostępny przez Api_auth.get_project.

#### Właścicielstwo projektów
[pentest]
Operacje na projekcie przez API sprawdzają, czy user_id projektu znalezionego przez api_key zgadza się z user_id projektu docelowego. Operacje w panelu admina sprawdzają, czy zalogowany user (Well.current_user) jest właścicielem projektu (Api_auth.ensure_project_owner).

### Dostęp klienta

#### Dostęp kliencki bez logowania
Widok kliencki (/p/:token i /p/:token/:mock_slug) nie wymaga logowania. Token w URL identyfikuje projekt. Klient widzi tylko moki ze statusem innym niż "draft" (filtr: m.status <> "draft"). Nie ma dodatkowego mechanizmu autoryzacji — każdy kto zna token, ma dostęp.

#### Imię autora komentarzy
Przed dodaniem komentarza klient musi podać swoje imię. Imię zapisywane w localStorage jako JSON {name, timestamp}. Wygasa po 24 godzinach (86400000 ms). Po wygaśnięciu ponowny prompt. Imię wpisywane w input "name-prompt-input", zatwierdzane przyciskiem lub Enterem.
