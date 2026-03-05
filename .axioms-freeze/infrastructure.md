# Infrastruktura

## Aksjomaty

### Konfiguracja aplikacji

#### Punkt wejścia aplikacji
bin/main.ml wywołuje App.run(). App.run() konfiguruje middleware (error_handler, auth_error_handler, logger, CSRF selektywny, rate_limit), rejestruje serwisy (ProjectAccess, MockAccess, CommentAccess), uruchamia seed usera, rejestruje LiveView /comments, mount statycznych plików (/static → static/), i startuje serwer (z domeną w produkcji, bez domeny w dev).

#### Middleware stack
Kolejność middleware: (1) Well.error_handler — łapie wyjątki, (2) auth_error_handler — Auth_denied → redirect /login, (3) Well.logger — logowanie requestów, (4) CSRF selektywny (nie dla /api/*), (5) rate_limit (60/10s).

#### Eventy — definicje typów
Dwa typy eventów z `[@@deriving yojson, topic]`: comment_event (CommentAdded int*int, CommentResolved int*int, CommentDeleted int*int) i mock_event (MockUploaded int*string, MockStatusChanged int*string). Topic name generowany automatycznie przez Well.

### Deploy

#### Skrypt deploy
deploy.sh: (1) `well release` tworzy archiwum, (2) SCP archiwum na serwer (HOST=fcmain, REMOTE_DIR=/opt/smock), (3) SSH extract, (4) rsync .env i smock.service, (5) systemctl daemon-reload, enable, restart.

#### Systemd service
smock.service: Type=simple, WorkingDirectory=/opt/smock, ExecStart=/opt/smock/bin/smock, Restart=on-failure (3s), EnvironmentFile=/opt/smock/.env. Hardening: NoNewPrivileges, ProtectSystem=strict, ProtectHome, ReadWritePaths=/opt/smock, PrivateTmp. AmbientCapabilities=CAP_NET_BIND_SERVICE (porty 80/443). Produkcja: PRODUCTION=true → HTTPS automatycznie (smock.finalclass.net).

### Build

#### System budowania
Dune project: lang 3.17, dialekt MLX (preprocess mlx-pp), pin well z GitHub SSH. Makefile: build (dune build), check (dune build @check), test (dune test), clean (dune clean), lock (dune pkg lock), dev (source .env + dune exec -w). TS→JS: bun build ts/mock-viewer.ts i well.ts, mode promote (wynik kopiowany do source tree).

#### Testy
Testy w test/smock_test.ml z Well_test. Istniejące testy: template processor (bez layoutu i z layoutem), slug generation (spacje, wielokrotne myślniki), S3 content type detection (css, html, js, png, unknown).
