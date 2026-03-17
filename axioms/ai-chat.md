# Budowanie mockupów z AI

Funkcjonalność budowania i edycji mockupów przez czat z AI. Administrator rozmawia z AI, które generuje i uploaduje pliki HTML/CSS/JS jako moki w projekcie. Komunikacja z AI przez serwis ai-access (http://localhost:9720).

## Aksjomaty

### Proxy do ai-access

#### Endpointy proxy
[test] [pentest]
Smock backend proxy'uje requesty do ai-access (http://localhost:9720, token z env AI_ACCESS_TOKEN). Wszystkie endpointy proxy wymagają auth admina + ownership projektu (ensure_project_owner). Endpointy nie podlegają CSRF (prefix /api/).

- **POST /api/projects/:id/ai/sessions** — tworzy sesję ai-access. Body: `{"name": "...", "mockId": null}` (nowy mock) lub `{"mockId": 42}` (edycja). Backend wywołuje POST /api/v1/sessions na ai-access z parametrami: repoOwner="fc", repoName="smock", issueIndex=mockId lub 0, issueTitle="Mockup: {name}", issueBody=[system prompt z instrukcjami](#system-prompt-dla-ai), apiToken=ARCHEA_TOKEN (scoped token Archea dla Claude — osobna zmienna env, NIE ta sama co AI_ACCESS_TOKEN). Jeśli mockId podany — pobiera aktualne pliki mocka z S3 i dołącza ich zawartość do issueBody. Jeśli brak mockId — tworzy draft mock z podaną nazwą i zapisuje ai_session_id. Zwraca: `{"sessionId": "...", "mockId": N}`.
- **POST /api/projects/:id/ai/sessions/:sid/send** — proxy do POST /api/v1/sessions/:sid/send. Body: `{"content": "..."}`.
- **GET /api/projects/:id/ai/sessions/:sid/stream** — proxy SSE z GET /api/v1/sessions/:sid/stream. Przekazuje eventy (status, message, closed) bezpośrednio do klienta jako Server-Sent Events.
- **GET /api/projects/:id/ai/sessions/:sid/messages** — proxy do GET /api/v1/sessions/:sid/messages. Przekazuje query param `after`.
- **POST /api/projects/:id/ai/sessions/:sid/stop** — proxy do POST /api/v1/sessions/:sid/stop.

Autoryzacja do ai-access: nagłówek `Authorization: Bearer {AI_ACCESS_TOKEN}` dodawany do każdego request do ai-access.

#### System prompt dla AI
Backend generuje system prompt (issueBody) dla sesji AI zawierający:
- Rolę: "Jesteś asystentem budującym mockupy UI w HTML/CSS/JS dla platformy Smock."
- Instrukcję: generuj czyste, nowoczesne HTML/CSS/JS. Używaj inline CSS lub osobnych plików CSS. Dbaj o responsywność.
- Adres API Smock: http://localhost:6000
- Token projektu i API key projektu (do autoryzacji uploadu)
- Instrukcję uploadu nowego mocka: `curl -X POST "http://localhost:6000/api/projects/{token}/mocks" -H "Authorization: Bearer {api_key}" -F "name={name}" -F "files[]=@index.html;filename=index.html" -F "files[]=@style.css;filename=style.css"`
- Instrukcję aktualizacji istniejącego mocka: `curl -X POST "http://localhost:6000/api/projects/{token}/mocks/{mock_id}/upload" -H "Authorization: Bearer {api_key}" -F "files[]=@index.html;filename=index.html"`
- Informację: po uploadzie mock pojawi się automatycznie w podglądzie po lewej stronie ekranu.
- Jeśli edycja istniejącego mocka: aktualna zawartość plików HTML/CSS/JS (każdy plik z nagłówkiem ścieżki)

#### Endpoint aktualizacji plików mocka
[test] [pentest]
POST /api/projects/:token/mocks/:id/upload — zastępuje pliki istniejącego mocka nowymi. Wymaga Bearer api_key + ownership. Multipart form-data z plikami (pole "files[]"). Flow: (1) pobiera mock, (2) kasuje stare pliki z S3 (S3_storage.delete_mock_files), (3) kasuje rekordy mock_files, (4) przetwarza szablony (Template_processor.process), (5) zapisuje nowe pliki na S3, (6) rejestruje w mock_files, (7) aktualizuje updated_at mocka, (8) publikuje event MockUploaded. Zwraca JSON: id, name, slug, status, entry_file.

### Komponent `<smock-ai-chat>`

Komponent Lit (`<smock-ai-chat>`, plik: `static/ts/smock-ai-chat.ts`) — interfejs czatu z AI do budowania mockupów. Nie używa LiveView.

#### Stan komponentu
Właściwości reaktywne: `projectId` (number, z atrybutu `project-id`), `mockId` (number|null, z atrybutu `mock-id`), `sessionId` (string|null, z atrybutu `session-id` lub tworzony dynamicznie), `mockName` (string, z atrybutu `mock-name`), `messages` (tablica Message), `inputText` (string), `isProcessing` (boolean — AI przetwarza), `isConnected` (boolean — SSE aktywny), `thinkingContent` (string — bieżąca treść thinking bloku streamowanego na żywo).

Typ Message: `{role: "user"|"assistant", content: string, contentType: "text"|"thinking"|"tool_use"|"tool_result"|"error", toolName: string, sequence: number}`.

#### Inicjalizacja i sesja
[e2e]
Przy `connectedCallback()`: jeśli `sessionId` podany (atrybut) — łączy się z SSE stream i ładuje historię wiadomości (GET messages?after=0). Jeśli brak `sessionId` — czeka na pierwszą wiadomość użytkownika, wtedy tworzy sesję (POST /api/projects/:projectId/ai/sessions z {name: mockName, mockId}) i po otrzymaniu sessionId łączy SSE.

Reconnect SSE: jeśli połączenie się zerwie, próba ponowna po 3s (max 5 prób). Przy reconnect pobiera brakujące wiadomości (after=lastSequence).

#### Renderowanie wiadomości
[e2e] [scenario]
Lista wiadomości w scrollowalnym kontenerze (.chat-messages, flex:1, overflow-y:auto). Każda wiadomość renderowana jako bąbelek:

- **Wiadomości user**: wyrównane do prawej, tło var(--accent), biały tekst, border-radius 12px 12px 0 12px, max-width 80%, padding 10px 16px.
- **Wiadomości assistant (text)**: wyrównane do lewej, tło var(--card-bg), border 1px solid var(--border), border-radius 12px 12px 12px 0, max-width 80%, padding 10px 16px. Treść renderowana jako markdown — nagłówki, listy, bold, italic, bloki kodu z tłem monospacowym.
- **Bloki thinking**: zwijany blok (details/summary). Nagłówek: "Myślenie..." z animowanym gradientem tła (shimmer) podczas streamowania. Treść w kolorze var(--muted), font-size 0.85rem, font-style italic. Domyślnie rozwinięty podczas streamowania, automatycznie zwijany po zakończeniu (gdy pojawi się kolejna wiadomość text). Klik na nagłówek rozwija/zwija.
- **Bloki tool_use**: zwijany blok (details/summary, domyślnie zwinięty). Nagłówek: ikona narzędzia (emoji) + toolName (monospace). Treść jako blok kodu.
- **Bloki tool_result**: dołączane wizualnie pod poprzednim tool_use. Treść jako blok kodu z max-height 200px i overflow-y scroll.

#### Auto-scroll
[e2e]
Kontener wiadomości (.chat-messages) automatycznie scrolluje do dołu (scrollTop = scrollHeight) gdy:
- Nowa wiadomość zostanie dodana do listy
- Treść istniejącej wiadomości się zaktualizuje (streaming tekstu lub thinking)
- WYJĄTEK: jeśli użytkownik ręcznie scrollował w górę (odległość od dołu > 100px), auto-scroll jest wyłączony do momentu gdy użytkownik scrolluje z powrotem na dół (odległość od dołu < 50px).

#### Pole wprowadzania wiadomości
[e2e] [scenario]
Kontener input (.chat-input-area) przypięty do dołu panelu czatu (flex-shrink:0, border-top 1px solid var(--border), padding 12px, background var(--bg)). Zawiera:
- **Textarea** (.chat-textarea): auto-resize (rośnie z treścią), min-height 44px, max-height 200px, border-radius 12px, border 1px solid var(--border), padding 10px 44px 10px 12px, width 100%, font-size 0.9rem, resize:none. Placeholder: "Opisz co chcesz zmienić..."
- **Przycisk wyślij**: pozycjonowany absolutnie w prawym dolnym rogu textarea. Ikona strzałki w górę (SVG). Background var(--accent), border-radius 50%, width 32px, height 32px. Disabled (opacity 0.4) gdy textarea pusta lub isProcessing=true.
- **Przycisk stop**: widoczny ZAMIAST przycisku wyślij gdy isProcessing=true. Ikona kwadratu (stop). Background var(--danger). Klik wywołuje POST stop.

**Ctrl+Enter**: wysyła wiadomość. Listener keydown na textarea: jeśli `e.ctrlKey && e.key === "Enter"` → `e.preventDefault()` + `sendMessage()`. Sam Enter — nowa linia.

**sendMessage()**: dodaje wiadomość user do messages (natychmiast widoczna), czyści textarea, resetuje wysokość textarea, wywołuje POST send z treścią wiadomości.

#### Obsługa SSE stream
Komponent otwiera EventSource na `/api/projects/${projectId}/ai/sessions/${sessionId}/stream`.

Eventy:
- `status`: parsuje JSON. Jeśli processing=true → isProcessing=true. Jeśli processing=false → isProcessing=false, jeśli thinkingContent niepusty → finalizuje blok thinking.
- `message`: parsuje JSON data. Logika:
  - contentType="thinking": append content do thinkingContent, aktualizuje/dodaje wiadomość thinking w messages.
  - contentType="text": jeśli ostatnia wiadomość assistant jest text — append content. W przeciwnym razie dodaje nową wiadomość. Jeśli thinkingContent niepusty — zamyka blok thinking (zwijanie).
  - contentType="tool_use": dodaje nową wiadomość z toolName.
  - contentType="tool_result": dodaje jako oddzielną wiadomość (wizualnie dołączana do poprzedniego tool_use).
  - contentType="error": dodaje wiadomość z czerwonym tłem.
- `closed`: isConnected=false, zamyka EventSource.

#### Odświeżanie podglądu mocka
Komponent nasłuchuje na kanale Well `mocks:{projectId}` (event `mock_uploaded`). Po otrzymaniu:
1. Emituje CustomEvent `mock-updated` z detalami {mockId, slug, entryFile} na elemencie — strona nasłuchuje i odświeża iframe src.
2. Jeśli to nowy mock (this.mockId było null) — aktualizuje this.mockId na wartość z eventu.

#### Wskaźnik przetwarzania
[scenario]
Gdy isProcessing=true i brak aktywnego thinking/text streamingu — wyświetla animowany wskaźnik "AI pisze..." na dole listy wiadomości: trzy pulsujące kropki (CSS animation, opacity 0→1→0, staggered delay) w szarym bąbelku po lewej stronie.

#### Stylizacja czatu
Panel czatu zajmuje prawą stronę (width 420px, flex-shrink:0, border-left 1px solid var(--border)). Pełna wysokość. Flex column: lista wiadomości (flex:1, overflow-y auto, padding 16px, gap 12px) + pole input (flex-shrink:0). Tło var(--bg). Czcionka system-ui. Spójny z admin design system (zmienne CSS z root).

### Budowanie

Plik `static/ts/smock-ai-chat.ts` kompilowany przez bun (reguła w `static/dune`, analogicznie do smock-comments.ts). Import Lit bundlowany przez bun. Wynikowy JS: `static/smock-ai-chat.js`, ładowany jako `<script type="module">` na stronach buildera/edytora.
