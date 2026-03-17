# Interfejs admina

## Aksjomaty

### Layout admina

#### Layout strony admina
Layout admina (layout.mlx) renderuje: DOCTYPE html, head z meta charset/viewport, title, link do /static/app.css. Body zawiera: header.admin-header z logo (img /static/logo.png, link do /), nawigacją (link "Projects" do / — widoczna tylko dla zalogowanych), info o userze (email + przycisk Logout — POST /logout z CSRF). Main.admin-main (max-width 64rem, centrowany) z treścią strony. Script: /static/well.js (type module).

### Strony admina

#### Strona główna — lista projektów
GET / (wymaga auth). Wyświetla nagłówek "Projects", formularz tworzenia projektu (input name + przycisk "Create Project"), listę projektów jako karty. Każda karta: nazwa (link do /projects/:id), token (monospace), data, link "Client view" (/p/:token). Brak projektów → "No projects yet. Create one above." POST /projects tworzy projekt i przekierowuje na /.

#### Strona szczegółów projektu
GET /projects/:id (wymaga auth + właściciel). Wyświetla: back link "Projects" do /, nazwę projektu, credentials (token, API Key, Client URL w grid), sekcję "Mocks" z nagłówkiem i przyciskiem "Dodaj nowy mockup" (link do /projects/:id/mocks/new, styl --accent, biały tekst, border-radius). Lista moków poniżej. Każdy mock: nazwa, status badge (kolorowa pill), slug, data, przyciski: "View" (link do /p/:token/:slug), "Edit" (link do /projects/:id/mocks/:mock_id/edit, ikona ołówka), select statusu z przyciskiem "Update" (POST), przycisk "Delete" (POST z confirm). Na dole: przycisk "Delete Project" (czerwony, POST /projects/:id/delete).

#### Strona logowania
GET /login wyświetla: logo Smock, nagłówek "Login", ewentualny komunikat błędu (z query param "error"), formularz (input email + password + przycisk Login), link do rejestracji. POST /login: logowanie przez Well.Auth.login_and_set_session, sukces → redirect /, błąd → redirect z error.

#### Strona rejestracji
GET /register wyświetla: logo, nagłówek "Register", formularz (email + password + password_confirm + przycisk Register), link do logowania. POST /register: walidacja hasła (password === password_confirm), Well.Auth.register, automatyczne logowanie, redirect na /.

### Mockup builder — budowanie z AI

#### Strona budowania nowego mockupu
[e2e] [scenario]
GET /projects/:id/mocks/new (wymaga auth + właściciel). Pełnoekranowy widok (100vh) w stylu viewer klienta. Struktura:
1. **Toolbar** (flex, na górze): back link "Projekt" do /projects/:id, input nazwy mocka (text, placeholder "Nazwa mockupu...", border-bottom, font-size 1.1rem), kontrolki viewport (Desktop/Mobile jak w viewer klienta).
2. **Content** (flex, reszta wysokości):
   - **iframe-wrapper** (flex:1): iframe z podglądem mocka. Początkowo pusty placeholder — szary box z tekstem "Mockup pojawi się tutaj po wygenerowaniu przez AI" (wycentrowany, kolor --muted). Po uploadzie mocka przez AI — iframe ładuje /p/:token/:slug/f/:entry_file. Select stron pojawia się w toolbarze po utworzeniu mocka (analogicznie do viewer klienta).
   - **Panel czatu AI** (prawa strona): komponent `<smock-ai-chat project-id=":id" mock-name="...">` — [szczegóły w AI chat](./ai-chat.md).

Strona nasłuchuje na CustomEvent `mock-updated` z komponentu czatu — odświeża iframe src, aktualizuje select stron, aktualizuje URL przeglądarki.

Scripts: /static/well.js, /static/mock-viewer.js, /static/smock-ai-chat.js (wszystkie type module).

#### Strona edycji istniejącego mockupu
[e2e] [scenario]
GET /projects/:id/mocks/:mock_id/edit (wymaga auth + właściciel). Identyczny layout jak strona budowania nowego mockupu, ale:
- Toolbar: zamiast inputa nazwy — wyświetla nazwę mocka (readonly), status badge.
- iframe: od razu ładuje aktualny mock (/p/:token/:slug/f/:entry_file), select stron od razu dostępny.
- Panel czatu: komponent `<smock-ai-chat project-id=":id" mock-id=":mock_id" session-id=":ai_session_id" mock-name=":name">`. Jeśli mock ma ai_session_id — ładuje historię czatu. Jeśli brak — tworzy nową sesję przy pierwszej wiadomości.

Strona nasłuchuje na `mock-updated` i odświeża iframe.

### Stylizacja admina

#### Design system — zmienne CSS
Root CSS variables: --bg (#fafafa), --fg (#1a1a1a), --muted (#6b7280), --border (#e5e7eb), --accent (#2563eb, hover: #1d4ed8), --success (#059669), --warning (#d97706), --danger (#dc2626), --card-bg (#fff), --radius (8px). System-ui font, line-height 1.6.

#### Status badges
Status wyświetlany jako kolorowa pill (.status): draft (szary), review (niebieski), approved (zielony), rejected (czerwony). Uppercase, font-size 0.75rem, border-radius 9999px.
