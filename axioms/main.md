# Smock — Axioms

Smock (Supermok) to platforma do review UI — alternatywa dla Figmy w kontekście pracy nad interfejsami generowanymi przez AI. Developer (lub skill AI) uploaduje mockupy HTML/CSS/JS przez API, klient dostaje krótki URL do przeglądania i zostawiania feedbacku w wątkach (jak w Figma). Skill AI czyta feedback klienta przez API i automatycznie poprawia UI.

## Słownik

- **Projekt** — kontener organizacyjny (np. "Redesign strony X"), ma api_key do zarządzania przez API i token do udostępniania klientom
- **Mock** — wersja designu (np. "Landing Page v1"), przypisany do projektu, zawiera pliki HTML/CSS/JS, ma status (draft/review/approved/rejected)
- **Strona mocka** — pojedynczy plik HTML w mocku (np. index.html, pricing.html), nawigacja między stronami w viewerze
- **Wątek (Thread)** — punkt feedbacku na mockupie, powiązany z pinem na pozycji x/y (%). Zawiera komentarze (pierwszy = treść otwierająca, kolejne = odpowiedzi). Może być resolved.
- **Komentarz** — tekstowa wiadomość w wątku (odpowiedź lub treść otwierająca)
- **Pin** — wizualny znacznik na mockupie wskazujący miejsce wątku. Każdy wątek ma pin — nie można komentować bez wskazania miejsca (flow jak w Figma)
- **Viewer** — widok przeglądania mocka z iframe, panelem komentarzy, overlay'em pinów i przełącznikiem desktop/mobile
- **Token** — 8-znakowy losowy string alfanumeryczny (lowercase) identyfikujący projekt w URL-ach klienckich
- **API Key** — 32-znakowy hex string do autoryzacji operacji API (Bearer token)
- **Slug** — wersja nazwy przyjazna URL-om (lowercase, myślniki zamiast spacji)
- **Entry file** — domyślny plik HTML wyświetlany po otwarciu mocka (domyślnie index.html)
- **Template processing** — jednorazowe przetwarzanie szablonów przy uploadzie: layout ({{layout: file}}) → yield ({{yield name}}) → bloki ({{name}}...{{/name}})
- **Serwer testowy** - serwer do testów: https://smock.finalclass.net (lokalnie: http://localhost:6000)

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

### [scenario] @satisfaction(0.9) +browser
AI chodzi po stronie i ocenia na ile dany aksjomat jest spelniony w skali od 0 do 1

## Aksjomaty
[lint]

- [Technologia](./technology.md)
- [Model danych](./data-model.md)
- [Autentykacja](./auth.md)
- [Zarządzanie projektami](./projects.md)
- [Zarządzanie mokami](./mocks.md)
- [System komentarzy](./comments.md)
- [CommentAccess](./comment-access.md)
- [Interfejs admina](./admin-ui.md)
- [Interfejs klienta](./client-ui.md)
- [Budowanie mockupów przez AI](./mock-builder.md)
- [API](./api.md)
- [Infrastruktura](./infrastructure.md)

### System

#### Cel systemu
Smock to platforma review UI — zamyka pętlę feedbacku między klientem a AI. Developer (lub skill AI) uploaduje mockupy HTML/CSS/JS przez API. Klient dostaje krótki URL, przegląda i zostawia feedback w wątkach (Figma-style: klik na mockup → pin → wątek z komentarzami). Skill AI czyta feedback przez API, poprawia UI, uploaduje nową wersję i oznacza wątki jako resolved. Cykl się powtarza aż klient zaakceptuje.

#### Dwa tryby dostępu
System ma dwa oddzielne tryby dostępu: (1) panel admina wymagający logowania (email + hasło, sesje) — dla developerów zarządzających projektami i mokami, (2) widok kliencki bez logowania — dostęp przez URL z tokenem projektu (/p/:token).

#### Eventy i real-time
System używa Well Channels do synchronizacji w real-time. Kanał `comments:{mock_id}` — eventy: `thread_created`, `comment_added`, `thread_resolved`, `thread_deleted`. Kanał `mocks:{project_id}` — eventy: `mock_uploaded`, `mock_status_changed`. Komponent Lit `<smock-comments>` łączy się z kanałem i aktualizuje UI bez przeładowania strony.
