# Smock — Axioms

Smock (Supermok) to narzędzie do prezentacji mockupów HTML/CSS/JS dla klientów. Developer uploaduje moki przez API, klient dostaje krótki URL do przeglądania i komentowania.

## Słownik

- **Projekt** — kontener organizacyjny (np. "Redesign strony X"), ma api_key do zarządzania przez API i token do udostępniania klientom
- **Mock** — wersja designu (np. "Landing Page v1"), przypisany do projektu, zawiera pliki HTML/CSS/JS, ma status (draft/review/approved/rejected)
- **Strona mocka** — pojedynczy plik HTML w mocku (np. index.html, pricing.html), nawigacja między stronami w viewerze
- **Komentarz** — tekstowa adnotacja do strony mocka, opcjonalnie z pinem na pozycji x/y (procent szerokości i wysokości)
- **Pin** — wizualny znacznik na mockupie wskazujący miejsce, którego dotyczy komentarz
- **Viewer** — widok przeglądania mocka z iframe, panelem komentarzy, overlay'em pinów i przełącznikiem desktop/mobile
- **Token** — 8-znakowy losowy string alfanumeryczny (lowercase) identyfikujący projekt w URL-ach klienckich
- **API Key** — 32-znakowy hex string do autoryzacji operacji API (Bearer token)
- **Slug** — wersja nazwy przyjazna URL-om (lowercase, myślniki zamiast spacji)
- **Entry file** — domyślny plik HTML wyświetlany po otwarciu mocka (domyślnie index.html)
- **Template processing** — jednorazowe przetwarzanie szablonów przy uploadzie: layout ({{layout: file}}) → yield ({{yield name}}) → bloki ({{name}}...{{/name}})
- **Serwer testowy** - serwer do testów: https://smock.finalclass.net

## Labels

### [test] @implementation @validation +code
Wymaga testów integracyjnych (testy API). Testy pisane w `test/smock_test.ml` z użyciem `Well_test` (describe/it/expect). TDD: testy najpierw, implementacja potem.
Aby dostać się do systemu ze świeżą bazą użyj danych dostępowych cap / admin
Testy robimy w osobnej bazie danych (in memory)

### [pentest] @validation +code +api
Wymaga przeglądu bezpieczeństwa: sprawdzenie autoryzacji, walidacji danych wejściowych, escapowania HTML, ochrony przed CSRF.

### [e2e] @implementation @validation +browser
Dany aksjomaty wymaga napisania testów e2e. Używamy frameworka playwright i testujemy no lokalnym komputerze. Czyli: W fazie weryfikacji uruchamiamy aplikacje a następnie odpalamy testy e2e. Jeśli jakiś nie przechodzi (niezależnie czy jest związany z obecnym aksjomatem czy nie) to naprawiamy aż zacznie działać
Aby dostać się do systemu ze świeżą bazą użyj danych dostępowych cap / admin

### [smoketest] @validation +api
Jeśli dany aksjomat się zmienił w etapie weryfikacji przeprowadź wdrożenie na testowy serwer (testing) i zobacz czy system jest dostępny

### [lint] @validation +code
Uruchom lintery do sprawdzania kodu
- dla ocaml: `dune @check`
- dla ts: `bun tsc --noEmit`

## Aksjomaty
[lint]

- [Technologia](./technology.md)
- [Model danych](./data-model.md)
- [Autentykacja](./auth.md)
- [Zarządzanie projektami](./projects.md)
- [Zarządzanie mokami](./mocks.md)
- [System komentarzy](./comments.md)
- [Interfejs admina](./admin-ui.md)
- [Interfejs klienta](./client-ui.md)
- [API](./api.md)
- [Infrastruktura](./infrastructure.md)

### System

#### Cel systemu
Smock umożliwia developerom prezentowanie mockupów HTML/CSS/JS klientom do przeglądu i komentowania. Developer uploaduje pliki przez API, system przetwarza szablony i przechowuje na S3. Klient dostaje krótki URL do przeglądania i może zostawiać komentarze z pinami wskazującymi konkretne miejsca na mockupie.

#### Dwa tryby dostępu
System ma dwa oddzielne tryby dostępu: (1) panel admina wymagający logowania (email + hasło, sesje) — dla developerów zarządzających projektami i mokami, (2) widok kliencki bez logowania — dostęp przez URL z tokenem projektu (/p/:token).

#### Eventy i real-time
System używa pub/sub eventów do synchronizacji w real-time. Dwa typy eventów: `comment_event` (`CommentAdded`, `CommentResolved`, `CommentDeleted` — każdy z `mock_id` i `comment_id/id`) oraz `mock_event` (`MockUploaded` z `id` i `name`, `MockStatusChanged` z `id` i `status`). LiveView subskrybuje eventy i odświeża UI automatycznie.
