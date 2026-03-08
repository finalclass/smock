# Interfejs klienta

#### Layout kliencki
Layout kliencki (client_layout.mlx) renderuje: DOCTYPE html, head z meta charset/viewport, title, link do /static/app.css. Body z class "client-body" (background #f0f0f0). Treść strony bez headera admina. Scripts: /static/well.js i /static/mock-viewer.js (oba type module).

### Strona projektu klienta

#### Lista moków dla klienta
GET /p/:token wyświetla: nagłówek z logo Smock (mały, w lewym górnym rogu, opacity 0.5, hover→1) i nazwą projektu (wycentrowaną). Siatka moków (.mock-grid, auto-fill, min 240px) jako kafelki (.mock-tile). Każdy kafelek: placeholder preview (szary box z 2 pierwszymi literami nazwy), nazwa i status badge. Klik na kafelek → /p/:token/:slug. Tylko moki ze statusem != "draft".

### Mock viewer

#### Viewer mocka — layout
GET /p/:token/:mock_slug wyświetla pełnoekranowy viewer (100vh). Struktura: (1) toolbar (flex, na górze) z logo, back link do projektu, tytuł mocka, select stron, kontrolki viewport (Desktop/Mobile), przycisk Comments, (2) content (flex, reszta) z iframe-wrapper (flex:1, iframe + comment-overlay) i comments-panel (320px, prawy panel z LiveView).

#### Nawigacja między stronami
Select (#page-select) listuje pliki HTML mocka (bez layout.html). Zmiana selecta: aktualizuje iframe.src, synchronizuje hidden input comment-page, czyści stan pina, wysyła event SetPage do LiveView. Wykrywanie nawigacji w iframe: po załadowaniu iframe sprawdza pathname i synchronizuje z selectem (detekcja kliknięcia linka wewnątrz mockupu).

#### Przełącznik Desktop/Mobile
Dwa przyciski viewport-btn. Desktop (domyślny, active): iframe na pełną szerokość. Mobile: iframe max-width 375px, wyśrodkowany. Aktywny przycisk: ciemne tło.

#### Panel komentarzy — toggle
Przycisk "Comments" (#comment-toggle) włącza/wyłącza widoczność panelu komentarzy i overlay'a. Domyślnie widoczne. Wyłączenie panelu wychodzi z trybu placingu.

#### Pushowanie eventów do LiveView
Funkcja pushLiveEvent(variant, arg): tworzy tymczasowy button z data-lv-click w formacie JSON array (["Variant", "value"]), dodaje do live-view, klika, usuwa. Umożliwia komunikację TypeScript → LiveView Well.
