# System komentarzy

System komentarzy zbudowany jako web component Lit.dev (`<smock-comments>`) w TypeScript. Cały stan i renderowanie po stronie klienta. Komunikacja z serwerem wyłącznie przez Well Channels (WebSocket) — zarówno komendy (tworzenie wątków, odpowiedzi, resolve, delete) jak i real-time eventy.


[scenario] Komentowanie działa jak w Figma: użytkownik klika w miejsce na mockupie → otwiera nowy wątek (thread) → pisze komentarz. Każdy pin na mockupie to osobny wątek z możliwością dodawania odpowiedzi. Nie można zostawić komentarza bez wskazania miejsca.

### Komponent Lit `<smock-comments>`

#### Stan komponentu
Komponent `SmockComments` (plik: `static/ts/smock-comments.ts`) rozszerza `LitElement`. Właściwości reaktywne: `mockId` (number, z atrybutu `mock-id`), `pagePath` (string, aktualna strona), `threads` (tablica Thread z zagnieżdżonymi comments), `authorName` (string, z localStorage), `showAll` (bool, tryb widoku), `hideResolved` (bool), `confirmDeleteId` (number|null, ID wątku do potwierdzenia usunięcia), `activeCompose` ({x: number, y: number} | null — pozycja otwartego formularza nowego wątku na overlay), `openThreadId` (number | null — ID otwartego wątku w panelu/dymku). Inicjalizacja: łączy się z kanałem `comments:{mock_id}`, po join otrzymuje aktualną listę wątków.

#### Kanał `comments:{mockId}`
Komponent łączy się z Well Channel `comments:{mockId}` przy `connectedCallback()`. Cała komunikacja odbywa się przez ten kanał:

**Komendy (push od klienta):**
- `create_thread` z payload `{page_path, x_pct, y_pct, author_name, body}` — tworzy wątek z pierwszym komentarzem
- `add_comment` z payload `{thread_id, author_name, body}` — dodaje odpowiedź w wątku
- `resolve_thread` z payload `{thread_id}` — oznacza wątek jako resolved
- `delete_thread` z payload `{thread_id}` — usuwa wątek ze wszystkimi komentarzami

**Eventy (push od serwera do wszystkich subskrybentów):**
- `thread_created` — zawiera pełny obiekt thread z pierwszym komentarzem
- `comment_added` — zawiera obiekt comment z thread_id
- `thread_resolved` — zawiera thread_id
- `thread_deleted` — zawiera thread_id

Na każdy event komponent aktualizuje lokalną tablicę `threads` bez ponownego pobierania. Przy `disconnectedCallback()` wywołuje `channel.leave()`.

#### Tryb komentowania vs nawigacja
[e2e]
Viewer ma dwa tryby interakcji z mockupem: **nawigacja** (domyślny) i **komentowanie**. W trybie nawigacji overlay nie przechwytuje kliknięć — użytkownik może normalnie klikać linki, scrollować i korzystać z mockupa. W trybie komentowania overlay przechwytuje kliknięcia i pozwala stawiać piny. Przełącznik trybów to przycisk w toolbarze (obok "Comments") z ikoną kursora (nawigacja) / pina (komentowanie). Aktywny tryb komentowania podświetla przycisk. Kursor w trybie komentowania: crosshair. Kursor w trybie nawigacji: default (iframe przejmuje).

#### Flow tworzenia nowego wątku (Figma-style)

[scenario] [e2e]
1. Użytkownik włącza tryb komentowania i klika w dowolne miejsce na overlay mockupa.
2. W klikniętym miejscu pojawia się pin (podgląd) i tuż obok dymek z formularzem: textarea + przycisk wyślij. Dymek pozycjonowany absolutnie przy pinie.
3. Użytkownik wpisuje treść komentarza i klika wyślij (lub Ctrl+Enter).
4. `channel.push("create_thread", {page_path, x_pct, y_pct, author_name, body})`.
5. Serwer tworzy thread + comment atomowo przez CommentAccess, rozgłasza `thread_created` do kanału.
6. Dymek zamienia się na widok wątku. Pin staje się pełnoprawnym numerowanym pinem.
7. Klik w inne miejsce overlay (gdy dymek jest otwarty) → zamyka bieżący dymek i otwiera nowy w nowym miejscu.
8. Escape → zamyka dymek bez wysyłania.

#### Flow odpowiadania w wątku
[e2e]

1. Użytkownik klika na istniejący pin lub na wątek w panelu bocznym.
2. Otwiera się dymek przy pinie (lub rozwinięcie w panelu) z: listą dotychczasowych komentarzy w wątku + textarea na odpowiedź.
3. Użytkownik wpisuje odpowiedź → `channel.push("add_comment", {thread_id, author_name, body})`.
4. Serwer dodaje komentarz przez CommentAccess, rozgłasza `comment_added`.

#### Resolve i usunięcie wątku
[e2e]
Resolve: `channel.push("resolve_thread", {thread_id})`. Serwer oznacza wątek jako resolved, rozgłasza `thread_resolved`. Usunięcie: dwuetapowe potwierdzenie w UI — klik Delete → "Sure?" → `channel.push("delete_thread", {thread_id})`. Serwer usuwa wątek kaskadowo, rozgłasza `thread_deleted`.

#### Wszystkie komentarze
[e2e]
Dwa tryby widoku w panelu bocznym: "Ta strona" (showAll=false) — wątki z bieżącej strony, "Wszystkie" (showAll=true) — wątki ze wszystkich stron, pogrupowane po stronie z nagłówkami. Przełącznik jako segmented buttons.

#### Ukrywanie resolved
[e2e] Checkbox "Hide resolved" ukrywa resolved wątki. Przełącznik zrobiony jako segmented buttons (toggle-btn).

### Panel boczny
[e2e] Panel boczny zawiera listę wątków (scrollowalna) i przełączniki "Ta strona" / "Wszystkie" oraz "Hide resolved". Panel NIE zawiera formularza tworzenia nowego wątku — nowy wątek tworzy się przez klik na overlay.

#### Renderowanie wątku w panelu
Każdy wątek wyświetla: numer pina, imię autora pierwszego komentarza, treść pierwszego komentarza (skrócona jeśli długa), liczbę odpowiedzi (np. "3 odpowiedzi"), nazwę strony (basename page_path). Klik na wątek → otwiera go (rozwijka z pełną listą komentarzy + pole odpowiedzi lub dymek przy pinie).

#### Renderowanie resolved wątków
Sekcja "Resolved" wyświetlana pod aktywnymi (jeśli są i hideResolved=false). Resolved wątki wyświetlają: autora, treść, bez przycisków akcji.

#### Formularz imienia
Jeśli użytkownik nie ma ustawionego imienia w localStorage (smock_author) i kliknie na overlay aby dodać wątek — zamiast formularza komentarza w dymku pojawia się formularz imienia: prompt "Podaj swoje imię" z inputem i przyciskiem OK. Po wpisaniu: zapisane do localStorage, formularz zamienia się na formularz komentarza w tym samym dymku.

#### Zmiana imienia
[e2e] Użytkownik ma możliwość kliknięcia "zmień imię" w panelu bocznym. Usuwamy dane z localStorage. Następny klik na overlay wyświetli [](#formularz-imienia).

### Serwer — handler kanału

W `app.ml` rejestracja kanału `comments:*`. Handler:
- **join** — autoryzuje dostęp (każdy może dołączyć), zwraca aktualną listę wątków z komentarzami (initial state)
- **push** — obsługuje komendy (`create_thread`, `add_comment`, `resolve_thread`, `delete_thread`), wywołuje CommentAccess, rozgłasza event do wszystkich subskrybentów kanału

### Piny na overlay

#### Renderowanie pinów
Komponent po każdej zmianie `threads` renderuje piny na overlay: dla każdego nie-resolved wątku z bieżącej strony tworzy numerowany pin (div.comment-pin) w pozycji x_pct/y_pct %. Piny numerowane kolejno (1, 2, 3...). Resolved wątki mają piny wyszarzone (jeśli widoczne).

#### Interakcja pinów z wątkami
Hover na pin → podświetlenie pina (scale 1.4) + podświetlenie wątku w panelu. Hover na wątek w panelu → podświetlenie pina. Klik na pin → otwiera dymek z wątkiem (lista komentarzy + pole odpowiedzi). Klik na wątek w panelu → scroll iframe do pozycji pina + podświetlenie. Jeśli wątek na innej stronie — najpierw nawigacja, potem scroll.

#### Synchronizacja overlay z iframe
Overlay synchronizowany z rozmiarem i scrollem dokumentu w iframe. syncOverlay() ustawia width/height overlay na scrollWidth/scrollHeight iframe i transform: translate(-scrollX, -scrollY). Listener na scroll i resize iframe'a. Po załadowaniu iframe — ponowna synchronizacja.

### Osadzenie w stronie

Strona mocka klienta (`client_mock_page.mlx`) osadza komponent jako `<smock-comments mock-id="..." entry-file="..."></smock-comments>`. Komponent sam zarządza połączeniem z kanałem i stanem. Nie wymaga LiveView.

### Budowanie

Plik `static/ts/smock-comments.ts` kompilowany przez bun (reguła w `static/dune`). Import Lit bundlowany przez bun. Wynikowy JS: `static/smock-comments.js`, ładowany jako `<script type="module">` na stronie mocka.

## Walidacja

[e2e] Użytkownik może dodać komentarz (wątek) na jednej stronie, następnie przejść na drugą stronę, kliknąć we "wszystkie komentarze" i wybrać wątek, który wcześniej stworzył - kliknąć w niego i w tym momencie zostaje przeniesiony do strony z tym wątkiem. Ekran jest też przescrollowany do miejsca gdzie pin został postawiony.

[e2e] Użytkownik tworzy wątek na jednej stronie, przechodzi na inną stronę mocka, klika we "wszystkie komentarze", widzi wątek utworzony wcześniej, następnie klika na "ta strona" aby wyświetlić wątki z obecnej strony i widzi jedynie wątki z tej strony.

[scenario] Po dodaniu komentarza, treść komentarza jest widoczna w "chmurce" danego wątku

[ui] Jeśli dodajemy komentarz po prawej stronie to chmurka komentarz powinna być widoczna a nie ucięta przez iframe mocka
