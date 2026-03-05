# System komentarzy

## Aksjomaty

### LiveView komentarzy

#### Model LiveView Comments
LiveView comments (comments_live.mlx) zarządza stanem: mock_id (int, ID mocka), page_path (string, aktualna strona), comments (lista comment_entry), author_name (string), show_all (bool, czy pokazać komentarze ze wszystkich stron), hide_resolved (bool, czy ukryć rozwiązane), confirm_delete (int option, ID komentarza do potwierdzenia usunięcia). Persistence: Ephemeral. Init: ładuje mock_id i entry_file z props (JSON), subskrybuje topic comment_event.

#### Dodawanie komentarza
Formularz komentarza (SubmitComment) zbiera: author (hidden, z localStorage), body (textarea), x/y (hidden, pozycja pina jako %), page (hidden, bieżąca strona). Po submicie: tworzenie komentarza przez Comment_access.create, publikacja eventu CommentAdded, przeładowanie listy komentarzy. Formularz zamontowany z data-lv-ignore="true" (Well nie nadpisuje przy re-renderze).

#### Resolve i usunięcie komentarza
Resolve (ResolveComment): ustawia resolved=1, publikuje CommentResolved. Usunięcie wymaga dwuetapowego potwierdzenia: (1) klik Delete → ustawia confirm_delete, (2) klik "Sure?" → kasuje komentarz i publikuje CommentDeleted. Klik Cancel → resetuje confirm_delete.

#### Filtrowanie komentarzy
Dwa tryby widoku: "Ta strona" (show_all=false) — tylko komentarze z bieżącej strony, "Wszystkie" (show_all=true) — komentarze ze wszystkich stron, pogrupowane po stronie z nagłówkami. Checkbox "Hide resolved" ukrywa rozwiązane komentarze. Przełącznik zrobiony jako segmented buttons (toggle-btn).

#### Real-time synchronizacja komentarzy
LiveView subskrybuje topic comment_event. Na każdy event (CommentAdded, CommentResolved, CommentDeleted) z mock_id równym modelowi — przeładowuje listę komentarzy z bazy. Umożliwia synchronizację między wieloma otwartymi tabami tego samego mocka.

### Widok komentarzy (HTML)

#### Renderowanie aktywnych komentarzy
Aktywny komentarz (nie-resolved) wyświetla: imię autora (strong), nazwę strony (basename page_path), treść (p.comment-body), przyciski akcji: Resolve i Delete. Każdy element .comment-item ma data-comment-id, data-comment-x, data-comment-y, data-comment-page — używane do synchronizacji pinów.

#### Renderowanie resolved komentarzy
Sekcja "Resolved" wyświetlana pod aktywnymi (jeśli są i hide_resolved=false). Resolved komentarze wyświetlają tylko: imię autora i treść (bez przycisków akcji).

#### Formularz imienia (name prompt)
Przed formularzem komentarza wyświetlany jest prompt "Aby komentować podaj swoje imię" z inputem i przyciskiem OK. Po wpisaniu imienia: zapisane do localStorage (smock_author z timestampem), prompt ukryty, formularz komentarza widoczny. Sprawdzanie imienia przy każdym renderze i zmianach DOM (MutationObserver).

### Piny na overlay

#### Placement pinów
Przycisk "place pin" (btn-place-pin, ikona SVG pinezki) włącza tryb placingu. W trybie placingu: overlay dostaje cursor crosshair i lekki niebieski background (placing class), kliknięcie na overlay oblicza pozycję jako % wymiarów overlay'a, pozycja zapisywana do hidden inputów comment-x/comment-y, podgląd pina (comment-pin-preview, szary dashed) wyświetlany na overlay. Escape wychodzi z trybu. Przycisk zmienia kolor: normalny→niebieski (accent), placing→żółty (warning, pulsujący), pin-set→zielony (success).

#### Renderowanie pinów na overlay
Po każdej zmianie DOM w panelu komentarzy (MutationObserver) renderPins(): usuwa stare piny, iteruje po .comment-item z data-comment-x/y, tworzy numerowane piny (div.comment-pin) na overlay w pozycji %. Tylko piny z bieżącej strony (page === currentPage). Piny z pozycją < 0 pomijane.

#### Interakcja pinów z komentarzami
Hover na pin → podświetlenie pina (scale 1.4, kolor warning) + podświetlenie komentarza (#dbeafe). Hover na komentarz → podświetlenie pina. Klik na pin → scroll do komentarza w panelu. Klik na komentarz → scroll iframe'a do pozycji pina + podświetlenie pina. Jeśli komentarz na innej stronie — najpierw nawigacja, potem scroll.

#### Synchronizacja overlay z iframe
Overlay synchronizowany z rozmiarem i scrollem dokumentu w iframe. syncOverlay() ustawia width/height overlay na scrollWidth/scrollHeight iframe i transform: translate(-scrollX, -scrollY). Listener na scroll i resize iframe'a. Po załadowaniu iframe — ponowna synchronizacja.

### Implementacja CommentAccess

#### CommentAccess — warstwa dostępu do SQLite
[test]
Implementacja CommentAccess (comment_access_impl.ml) z `[@@deriving table ~name:"comments"]`. Operacje: list_by_mock (SELECT ORDER BY id DESC), create (INSERT z resolved=0 i timestampem), resolve (UPDATE SET resolved=1), delete (DELETE WHERE id). Konwersja resolved: int w bazie (0/1) → bool w typie Comment.t.
