# Smock (Supermok) - Plan implementacji

## Kontekst

Smock to narzedzie do prezentacji mockupow HTML/CSS/JS dla klientow. Developer (przez Claude Code lub API) uploaduje moki, klient dostaje krotki URL do przegladania i komentowania. Projekt oparty o framework Well (OCaml), deploy jako pojedyncza binarka.

Domena: smock.finalclass.net

## Kluczowe decyzje

- **Storage**: S3 (Well.S3) - pliki mockow na S3
- **Auth API**: `SMOCK_ADMIN_KEY` (env var) wymagany do tworzenia projektow
- **Auth klienta**: token w URL (`/p/klient1?token=abc12345`)
- **Komentarze**: Imie wymagane (zapisywane w sesji przegladarki)
- **Upload**: Multipart form-data z plikami
- **Tokeny**: 8 znakow alfanumerycznych (lowercase)

## Koncepcje

- **Projekt** - kontener (np. "Redesign strony X"), ma api_key do zarzadzania przez API
- **Klient** - odbiorca mokow, ma slug (URL) i token dostepu, widzi tylko swoje moki
- **Mock** - wersja designu (np. "Landing Page v1"), przypisany do klienta, zawiera pliki HTML/CSS/JS
- **Komentarz** - pin na pozycji x/y na stronie mocka, z imieniem autora

---

## Architektura IDesign

```
CLIENT LAYER
  +-- API Client         (developer: upload, manage)
  +-- Admin Web Client   (developer: dashboard)
  +-- Viewer Web Client  (klient: browse, view, comment)

MANAGER LAYER
  +-- PublishingManager   (workflow: upload -> process -> store -> assign)
  +-- ReviewManager       (workflow: browse -> view -> comment -> resolve)

ENGINE LAYER
  +-- ProcessingEngine    (activity: template/layout processing, validation, analysis)

RESOURCE ACCESS LAYER
  +-- ProjectAccess       (organizacja: projekty + klienci)
  +-- MockAccess          (cykl zycia mockow: metadata + pliki)
  +-- StorageAccess       (persystencja plikow: S3)
  +-- FeedbackAccess      (komentarze/feedback)

RESOURCE LAYER                          UTILITIES
  +-- SQLite (metadane)                   +-- API Auth middleware
  +-- S3 (pliki mokow)                    +-- Token generation
```

Proporcje: 2 Managers : 1 Engine : 4 Access (golden ratio: 2M -> ~1E)

---

## Call Chains (Core Use Cases)

### UC1: Developer uploaduje mocka

```
API Client -> PublishingManager
  -> ProjectAccess.Authenticate(api_key)         -> project
  -> ProcessingEngine.Process(files)              -> processed files
  -> ProcessingEngine.Analyze(processed_files)    -> metadata (pages, entry)
  -> MockAccess.Register(client_id, name, meta)   -> mock
  -> StorageAccess.Deposit(mock_id, files)        -> ok
  -> return mock + URL
```

### UC2: Klient przeglada swoje moki

```
Viewer Client -> ReviewManager
  -> ProjectAccess.ResolveClient(slug, token)     -> client
  -> MockAccess.Catalog(client_id)                -> mock list
  -> return rendered list
```

### UC3: Klient oglada mocka

```
Viewer Client -> ReviewManager
  -> ProjectAccess.ResolveClient(slug, token)     -> client
  -> MockAccess.Inspect(mock_id)                  -> mock + file list
  -> StorageAccess.Retrieve(mock_id, path)        -> file content
  -> return viewer + content
```

### UC4: Klient komentuje

```
Viewer Client -> ReviewManager
  -> FeedbackAccess.Annotate(mock_id, page, x, y, author, body)  -> comment
  -> publish CommentAdded event
```

### UC5: Developer sprawdza feedback

```
API/Admin Client -> ReviewManager
  -> ProjectAccess.Authenticate(api_key)          -> project
  -> FeedbackAccess.Collect(mock_id)              -> comments
  -> return comments
```

---

## Kontrakty serwisow

### PublishingManager (3 operacje)

```
Publish(api_key, client_slug, name, files[])  -> Mock + URL
UpdateStatus(api_key, mock_id, status)         -> Mock
Unpublish(api_key, mock_id)                    -> Ok
```

### ReviewManager (5 operacji)

```
Browse(client_slug, token)                           -> MockList
View(client_slug, token, mock_slug)                  -> MockDetail + FileList
Serve(client_slug, token, mock_slug, file_path)      -> FileContent
Comment(mock_id, page, x_pct, y_pct, author, body)  -> Comment
Resolve(comment_id, resolved)                         -> Comment
```

### ProcessingEngine (3 operacje)

```
Process(files[])   -> processed files[] (layout/yield resolved)
Validate(files[])  -> ValidationResult (errors, warnings)
Analyze(files[])   -> MockMetadata (pages, entry_file, titles)
```

### ProjectAccess (5 operacji)

```
Establish(name)              -> Project (with generated api_key)
Enroll(project_id, name)     -> Client (with generated slug + token)
Authenticate(api_key)        -> Project
ResolveClient(slug, token)   -> Client
Catalog(project_id)          -> ClientList
```

### MockAccess (5 operacji)

```
Register(client_id, name, slug, entry_file)  -> Mock
Catalog(client_id)                            -> MockList
Inspect(mock_id)                              -> Mock + FileList
Advance(mock_id, new_status)                  -> Mock
Retire(mock_id)                               -> Ok
```

### StorageAccess (3 operacje)

```
Deposit(mock_id, path, content, content_type)  -> Ok
Retrieve(mock_id, path)                         -> FileContent
Purge(mock_id)                                  -> Ok
```

### FeedbackAccess (4 operacje)

```
Annotate(mock_id, page_path, x_pct, y_pct, author, body)  -> Comment
Settle(comment_id, resolved)                                -> Comment
Collect(mock_id, ?page_path)                                -> CommentList
Remove(comment_id)                                          -> Ok
```

Wszystkie kontrakty: 3-5 operacji (optimum IDesign).

---

## Model danych

```sql
projects:   id, name, api_key, created_at
clients:    id, project_id, name, slug, token, created_at
mocks:      id, client_id, name, slug, status, entry_file, created_at, updated_at
mock_files: id, mock_id, path, content_type, size
comments:   id, mock_id, page_path, x_pct, y_pct, author_name, body, resolved, created_at
```

Statusy mockow: draft | review | approved | rejected

---

## System szablonow (template processing)

Przetwarzanie jednorazowe przy uploadzie (nie przy kazdym renderowaniu).

Plik strony:
```html
{{layout: main_layout.html}}
{{content}}
<h1>Moja strona</h1>
<p>Tresc</p>
{{/content}}
```

Plik layoutu:
```html
<!DOCTYPE html>
<html>
<head><title>Mock</title></head>
<body>
  <nav>...</nav>
  {{yield}}
  <footer>...</footer>
</body>
</html>
```

Wynik: layout z wstawiona trescia, zapisany jako statyczny HTML na S3.

---

## Routing

### API (developer)

```
POST   /api/projects                         - utworz projekt (SMOCK_ADMIN_KEY)
POST   /api/projects/:id/clients             - utworz klienta w projekcie (api_key)
POST   /api/projects/:token/mocks            - upload mocka (api_key, multipart)
PUT    /api/projects/:token/mocks/:id        - zmien status (api_key)
DELETE /api/projects/:token/mocks/:id        - usun mocka (api_key)
GET    /api/projects/:token/mocks            - lista mockow (api_key)
GET    /api/projects/:token/mocks/:id/comments - lista komentarzy (api_key)
```

### Widok klienta

```
GET /p/:client_slug?token=xxx                        - lista mockow klienta
GET /p/:client_slug/:mock_slug?token=xxx             - viewer mocka
GET /p/:client_slug/:mock_slug/f/:path?token=xxx     - plik mocka (z S3)
```

### Admin (developer web)

```
GET  /                    - lista projektow
GET  /projects/:id        - szczegoly projektu + klienci + moki
POST /projects            - utworz projekt (formularz)
POST /projects/:id/clients - utworz klienta (formularz)
```

---

## Fazy implementacji

### Faza 1: Fundament - kontrakty i access layer

1. Kontrakty TOML: ProjectAccess, MockAccess, StorageAccess, FeedbackAccess
2. `well contract build .`
3. Implementacje access: project_access_impl, mock_access_impl, feedback_access_impl
4. StorageAccess impl (Well.S3: deposit/retrieve/purge)
5. Eventy pub/sub (comment_event, mock_event)
6. Aktualizacja app.ml (rejestracja serwisow)

### Faza 2: Engine + Managers

1. ProcessingEngine impl (template processing, validation, analysis)
2. PublishingManager impl (upload workflow)
3. ReviewManager impl (browse/view/comment workflow)
4. API auth middleware (Bearer token + SMOCK_ADMIN_KEY)

### Faza 3: API routes

1. Endpointy API (project CRUD, mock upload, status, comments)
2. Testy integracyjne API

### Faza 4: Strony admina

1. Layout Smock
2. Home page (lista projektow)
3. Project page (szczegoly, klienci, moki)
4. CSS

### Faza 5: Widok klienta

1. Client layout (czysty, prezentacyjny)
2. Client project page (lista mockow z miniaturkami)
3. Mock viewer (iframe, nawigacja, desktop/mobile toggle)
4. Serwowanie plikow z S3
5. mock-viewer.ts (hooks Well)

### Faza 6: System komentarzy (LiveView)

1. Comments LiveView (piny, formularz, panel boczny)
2. comment-overlay.ts (interakcja z pinami)
3. Real-time aktualizacje (pub/sub)

### Faza 7: Polish + Claude Code Skill

1. Skill `.claude/skills/smock-api/SKILL.md`
2. Usuniecie demo plikow
3. Testy
4. Konfiguracja produkcyjna

---

## Pliki do stworzenia

```
NOWE:
  lib/contract/ProjectAccess.toml
  lib/contract/MockAccess.toml
  lib/contract/StorageAccess.toml       (opcjonalnie - moze byc czysty modul)
  lib/contract/FeedbackAccess.toml
  lib/contract/PublishingManager.toml
  lib/contract/ReviewManager.toml
  lib/contract/ProcessingEngine.toml
  lib/project_access/project_access_impl.ml
  lib/mock_access/mock_access_impl.ml
  lib/storage_access/storage_access_impl.ml
  lib/feedback_access/feedback_access_impl.ml
  lib/publishing_manager/publishing_manager_impl.ml
  lib/review_manager/review_manager_impl.ml
  lib/processing_engine/processing_engine_impl.ml
  lib/api_auth.ml
  lib/client/widgets/client_layout.mlx
  lib/client/pages/project_page.mlx
  lib/client/pages/client_project_page.mlx
  lib/client/pages/client_mock_page.mlx
  lib/client/pages/api_routes.ml
  lib/client/live/comments_live.mlx
  static/ts/mock-viewer.ts
  static/ts/comment-overlay.ts
  .claude/skills/smock-api/SKILL.md

REWRITE:
  lib/app.ml
  lib/events.ml
  lib/client/widgets/layout.mlx
  lib/client/pages/home_page.mlx
  static/app.css
  test/smock_test.ml

DO USUNIECIA (faza 7):
  lib/client/pages/counter_page.mlx
  lib/client/pages/dashboard_page.mlx
  lib/client/pages/notes_page.mlx
  lib/client/pages/tasks_page.mlx
  lib/client/pages/upload_page.mlx
  lib/client/pages/login_page.mlx
  lib/client/pages/signup_page.mlx
  lib/client/live/counter_live.mlx
  lib/client/live/activity_log_live.mlx
  lib/note_access/note_access_impl.ml
  lib/task_access/task_access_impl.ml
  lib/task_manager/task_manager_impl.ml
  lib/contract/NoteAccess.toml
  lib/contract/TaskAccess.toml
  lib/contract/TaskManager.toml
  + wygenerowane pliki z build/
```

---

## Weryfikacja

1. `make build` - kompilacja bez bledow
2. `make test` - testy przechodza
3. Curl: POST /api/projects -> projekt z api_key
4. Curl: POST /api/projects/:id/clients -> klient ze slug + token
5. Curl: POST /api/projects/:token/mocks z plikami -> mock utworzony na S3
6. Przegladarka: GET /p/klient1?token=xxx -> lista mockow
7. Przegladarka: GET /p/klient1/landing-v1?token=xxx -> viewer z iframe, toggle desktop/mobile
8. Przegladarka: klikniecie na mock -> pin + formularz komentarza
9. Dwa taby: komentarz w jednym pojawia sie w drugim (real-time)
10. API: GET /api/projects/:token/mocks/:id/comments -> lista komentarzy
