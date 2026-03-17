# Budowanie mockupów przez AI

Administrator może tworzyć nowe mockupy i edytować istniejące przez czat z AI. Widok buildera wygląda jak viewer kliencki (iframe z podglądem mocka po lewej), ale zamiast panelu komentarzy po prawej jest czat z AI. Administrator pisze prompty, AI generuje/modyfikuje pliki HTML/CSS/JS mocka i uploaduje je przez API smocka. Podgląd odświeża się automatycznie po każdym uploadzie.

Strony buildera (nowy mock, edycja) opisane w [Interfejs admina](./admin-ui.md).

## Aksjomaty

### Komponent AI Chat — `<smock-ai-chat>`

Komponent Lit (NIE LiveView). Plik: `static/ts/smock-ai-chat.ts`. Import Lit bundlowany przez bun. Wynikowy JS: `static/smock-ai-chat.js`.

#### Stan komponentu
[e2e]
Komponent `SmockAiChat` rozszerza `LitElement`. Właściwości reaktywne: `sessionId` (string, z atrybutu `session-id` — może być pusty, sesja tworzona przy pierwszej wiadomości), `projectId` (number, z atrybutu `project-id`), `mockId` (number, z atrybutu `mock-id`, opcjonalny — 0 dla nowego mocka), `mockName` (string, z atrybutu `mock-name`), `messages` (tablica wiadomości czatu), `inputText` (string, treść textarea), `processing` (bool, czy AI przetwarza), `autoScroll` (bool, domyślnie true), `connected` (bool, stan połączenia SSE).

#### Inicjalizacja i historia
Przy `connectedCallback()`: jeśli sessionId ustawiony — (1) pobiera historię wiadomości GET /api/projects/:projectId/ai/sessions/:sessionId/messages, (2) wyświetla istniejące wiadomości, (3) łączy się ze streamem SSE GET /api/projects/:projectId/ai/sessions/:sessionId/stream. Jeśli brak sessionId (nowa sesja) — wyświetla wiadomość powitalną: "Opisz mockup, który chcesz stworzyć. AI wygeneruje pliki HTML/CSS/JS." Sesja tworzona dopiero przy pierwszej wiadomości użytkownika.

#### Interfejs czatu — layout CSS
[e2e] [scenario]
Czat zajmuje pełną wysokość panelu (100%). Flex column. (1) Nagłówek panelu: "AI Chat" z ikoną, tło lekko ciemniejsze, padding, border-bottom. (2) Lista wiadomości: flex:1, overflow-y: auto, padding, scroll-behavior: smooth, gap między wiadomościami. (3) Pole input: flex-shrink:0, przypięte do dołu panelu (nie scrolluje się z wiadomościami), border-top jako separator, padding.

#### Wiadomości — auto-scroll
[e2e]
Po każdej nowej wiadomości lub fragmencie streamu lista automatycznie scrolluje do dołu (scrollTop = scrollHeight). Wyjątek: jeśli użytkownik ręcznie przewinął w górę (scroll position > 50px od dołu), auto-scroll się wyłącza (autoScroll = false). Auto-scroll wraca gdy użytkownik przewinie na dół (w obrębie 50px od dołu). Detekcja: event scroll na kontenerze wiadomości.

#### Pole input — zachowanie klawiszy
[e2e]
Textarea z przyciskiem "Send" (ikona strzałki w prawo). **Ctrl+Enter** (lub Cmd+Enter na Mac) wysyła wiadomość. **Enter** bez modyfikatora wstawia nową linię. Przycisk "Send" i skrót Ctrl+Enter wyłączone gdy: AI przetwarza (processing=true) lub textarea puste. Textarea auto-resize: wysokość rośnie z treścią (min 2 linie, max 200px). Po wysłaniu textarea się czyści i wraca do minimalnej wysokości. Focus wraca na textarea.

#### Wyświetlanie wiadomości użytkownika
Wiadomości użytkownika (role: "user") wyświetlane jako bąbelki wyrównane do prawej. Tło: var(--accent) (#2563eb), tekst biały. White-space: pre-wrap. Border-radius: 12px 12px 0 12px. Max-width: 85%. Padding: 8px 14px.

#### Wyświetlanie odpowiedzi AI — tekst
[scenario]
Wiadomości AI (role: "assistant", contentType: "text") wyświetlane po lewej stronie. Tło: var(--card-bg) z border. Treść renderowana z Markdown (nagłówki, listy, bold, italic, bloki kodu z `<pre><code>`). Tekst streamowany — pojawia się przyrostowo w miarę odbierania z SSE (aktualizacja ostatniej wiadomości assistant). Max-width: 85%. Border-radius: 12px 12px 12px 0. Padding: 10px 14px.

#### Wyświetlanie odpowiedzi AI — thinking
[e2e]
Bloki thinking (contentType: "thinking") wyświetlane jako zwijany (collapsible) element. Domyślnie zwinięty z etykietą "Thinking..." i ikonką chevron (▶/▼). Tło lekko fioletowe/szare (#f3f0ff / #f8f8f8), opacity 0.9. Rozwinięcie (klik na nagłówek) pokazuje treść myślenia (monospace, mniejszy font 0.8rem, kolor --muted). Podczas gdy AI myśli (processing=true i ostatni blok to thinking) — animacja pulsowania na etykiecie (CSS animation: opacity 0.4→1→0.4, 1.5s infinite).

#### Wyświetlanie odpowiedzi AI — tool use i tool result
Bloki tool_use (contentType: "tool_use") wyświetlane jako kompaktowy zwijany element: ikona narzędzia (🔧), nazwa narzędzia (toolName, bold), skrócony podgląd (pierwsze 80 znaków). Domyślnie zwinięty. Rozwinięcie: pełne parametry/treść w `<pre>` z formatowaniem JSON (white-space: pre-wrap). Bloki tool_result (contentType: "tool_result") wyświetlane pod odpowiadającym tool_use jako mniejszy blok: ikona ✓ (zielona), skrócony wynik (pierwsze 100 znaków). Rozwinięcie: pełny wynik. Oba typy: tło jasnoszare (#f5f5f5), font-size 0.8rem, border-radius 6px.

#### Stan "AI pracuje"
[e2e]
Gdy processing=true, na dole listy wiadomości (przed polem input) wyświetla się indicator: trzy animowane pulsujące kropki (CSS @keyframes: scale 0.4→1→0.4, staggered delay 0s/0.2s/0.4s). Indicator znika gdy processing zmieni się na false. Dodatkowo przycisk "Send" zamienia się na przycisk "Stop" (czerwony background, ikona ■ square) — klik wysyła POST /api/projects/:projectId/ai/sessions/:sessionId/stop.

#### Połączenie SSE
Komponent łączy się z GET /api/projects/:projectId/ai/sessions/:sessionId/stream (endpoint na smock backend, proxy do ai-access). EventSource. Obsługiwane eventy:
- `status` — parsuje JSON, aktualizuje processing (true gdy status=running)
- `message` — parsuje JSON {role, content, contentType, toolName, sequence}, dodaje wiadomość do listy lub aktualizuje ostatnią (streaming text — jeśli kolejna wiadomość text ma ten sam sequence, dołącza treść). Wiadomości mają sequence — używane do deduplikacji z historią.
- `closed` — sesja zakończona, ustawia connected=false

Przy EventSource.onerror — wyświetla indicator "Reconnecting..." (kolor --warning). EventSource reconnectuje natywnie. Przy połączeniu: indicator znika.

#### Wysyłanie wiadomości
POST /api/projects/:projectId/ai/sessions/:sessionId/send z JSON {content: "treść wiadomości"}. Jeśli brak sessionId (pierwsza wiadomość) — najpierw POST /api/projects/:projectId/ai/sessions z {mockId, mockName} aby utworzyć sesję, pobrać sessionId, połączyć SSE, a następnie wysłać wiadomość. Po wysłaniu: (1) wiadomość natychmiast dodana do listy (optimistic update, role: "user"), (2) textarea wyczyszczona, (3) processing ustawione na true do czasu odpowiedzi status z SSE.

#### Emitowanie eventu mock-updated
Komponent monitoruje wiadomości AI. Gdy wykryje w treści odpowiedzi sygnał uploadu mocka (tool_result zawierający slug i file_count, lub wiadomość text wspominającą o uploadzie) — emituje CustomEvent `mock-updated` z {mockId, slug} na elemencie. Strona buildera nasłuchuje tego eventu i odświeża iframe.

### Backend proxy do ai-access

#### Endpointy proxy
[pentest]
Smock backend proxy'uje requesty do ai-access (adres z env AI_ACCESS_URL, domyślnie http://localhost:9720). Token autoryzacji do ai-access z env AI_ACCESS_TOKEN. Wszystkie endpointy proxy wymagają zalogowanego admina (session auth, NIE Bearer api_key). Sprawdzenie ownership projektu (zalogowany user === właściciel).

Endpointy (pod /api/projects/:id/ai/):
- POST /api/projects/:id/ai/sessions — tworzy sesję, zwraca {sessionId, status}
- POST /api/projects/:id/ai/sessions/:sid/send — przekazuje {content} do ai-access, zwraca {ok: true}
- GET /api/projects/:id/ai/sessions/:sid/stream — proxy SSE stream z ai-access (chunked transfer, passthrough eventów)
- GET /api/projects/:id/ai/sessions/:sid/messages — proxy historii wiadomości (query param after)
- POST /api/projects/:id/ai/sessions/:sid/stop — zatrzymuje przetwarzanie, zwraca {ok: true}
- DELETE /api/projects/:id/ai/sessions/:sid — kasuje sesję, zwraca {ok: true}

#### Tworzenie sesji ai-access
POST /api/projects/:id/ai/sessions przyjmuje JSON: {mockId, mockName}. Backend:
1. Pobiera projekt z bazy (sprawdza ownership zalogowanego usera)
2. Pobiera mock z bazy (jeśli mockId > 0) lub tworzy nowy mock (draft, name z mockName)
3. Konstruuje request do ai-access POST /api/v1/sessions:
   - repoOwner: "fc", repoName: "smock"
   - issueIndex: mock_id (jako identyfikator)
   - issueTitle: "Build mockup: {mock_name}"
   - issueBody: system prompt z instrukcjami (patrz: [System prompt](#system-prompt-dla-ai))
   - apiToken: wartość env ARCHEA_TOKEN
4. Zapisuje ai_session_id na mocku w bazie (MockAccess.set_ai_session)
5. Zwraca {sessionId, mockId, mockSlug, status}

#### System prompt dla AI
System prompt przekazywany w issueBody sesji ai-access zawiera:
- Rolę: "Jesteś ekspertem UI/UX. Twoim zadaniem jest budowanie mockupów stron webowych w HTML/CSS/JS."
- API smocka: adres serwera (https://smock.finalclass.net), endpoint uploadu/aktualizacji plików
- Credentials: token projektu i API key — aby AI mogło uploadować pliki przez API smocka
- Dla nowego mocka: instrukcja utworzenia plików i uploadu przez POST /api/projects/:token/mocks (multipart z name i plikami)
- Dla edycji: lista istniejących plików mocka z ich ścieżkami, instrukcja modyfikacji i uploadu zaktualizowanych plików przez PUT /api/projects/:token/mocks/:slug/files
- Format uploadu: multipart form-data (curl -X PUT -H "Authorization: Bearer {api_key}" -F "file=@index.html;filename=index.html" ...)
- Zasady: generuj responsywny HTML, używaj nowoczesnego CSS (flexbox, grid, custom properties), pliki powinny być samodzielne (inline styles lub osobny plik CSS), entry_file to index.html

### Aktualizacja plików mocka

#### PUT /api/projects/:token/mocks/:slug/files — aktualizacja plików
[test] [pentest]
Wymaga Bearer api_key. Multipart form-data z plikami (pole "file" lub wiele pól z plikami). Sprawdza ownership (user_id projektu api_key === user_id projektu token). Operacja: (1) kasuje stare pliki z S3 (S3_storage.delete_mock_files), (2) kasuje rekordy mock_files z bazy, (3) przetwarza szablony nowych plików (Template_processor.process), (4) zapisuje nowe pliki na S3, (5) rejestruje w mock_files, (6) aktualizuje entry_file mocka (ta sama logika priorytetów co przy uploadzie: index.html > pierwszy HTML nie layout.html > pierwszy plik), (7) aktualizuje updated_at, (8) publikuje event MockUploaded na kanale mocks:{project_id}. Zwraca JSON: {id, name, slug, status, entry_file, file_count}.

### Odświeżanie podglądu

#### Auto-refresh iframe po uploadzie
[e2e]
Strona buildera (nie komponent czatu) nasłuchuje na kanale `mocks:{project_id}` event `mock_uploaded` (przez Well Channel, analogicznie do istniejącego mechanizmu). Po otrzymaniu eventu odświeża iframe z podglądem: ustawia iframe.src z dodanym/zaktualizowanym query param `?t={timestamp}` aby wymusić przeładowanie (bypass cache). Jeśli iframe był pusty (nowy mock) — ustawia src na /p/:token/:slug/f/:entry_file. Dodatkowo nasłuchuje na CustomEvent `mock-updated` z komponentu czatu jako fallback.

### Budowanie

#### Kompilacja smock-ai-chat.ts
Plik `static/ts/smock-ai-chat.ts` kompilowany przez bun (reguła w `static/dune`, analogicznie do smock-comments.ts i mock-viewer.ts). Import Lit bundlowany przez bun. Wynikowy JS: `static/smock-ai-chat.js`, ładowany jako `<script type="module">` na stronach buildera.
