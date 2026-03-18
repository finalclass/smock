# Infrastruktura

### Konfiguracja aplikacji

#### Punkt wejścia aplikacji
bin/main.ml wywołuje App.run(). App.run() konfiguruje middleware (error_handler, auth_error_handler, logger, CSRF selektywny, rate_limit), rejestruje serwisy (ProjectAccess, MockAccess, CommentAccess), wystawia CommentAccess jako RPC (`Well.Service.expose "CommentAccess"`), rejestruje kanał `comments:*`, uruchamia seed usera, mount statycznych plików (/static → static/), i startuje serwer na porcie 6000 (zarówno lokalnie jak i na produkcji).

#### Middleware stack
Kolejność middleware: (1) Well.error_handler — łapie wyjątki, (2) auth_error_handler — Auth_denied → redirect /login, (3) Well.logger — logowanie requestów, (4) CSRF selektywny (nie dla /api/*), (5) rate_limit (60/10s).

### Deploy

#### Skrypt deploy
deploy.sh działa lokalnie na serwerze (smock jest na tej samej maszynie): (1) `well release` tworzy archiwum, (2) extract do /opt/smock, (3) systemctl restart smock. Skrypt NIE ustawia PRODUCTION=true — TLS terminuje Caddy.

#### Systemd service
smock.service: Type=simple, WorkingDirectory=/opt/smock, ExecStart=/opt/smock/bin/smock, Restart=on-failure (3s), EnvironmentFile=/opt/smock/.env. Hardening: NoNewPrivileges, ProtectSystem=strict, ProtectHome, ReadWritePaths=/opt/smock, PrivateTmp. Port 6000 (plain HTTP). TLS terminuje Caddy reverse proxy (smock.finalclass.net → localhost:6000).

#### Caddy reverse proxy
[smoketest]
Caddy na serwerze (fcmain) terminuje TLS i proxy'uje do aplikacji. Konfiguracja w `/etc/caddy/Caddyfile`:

```
smock.finalclass.net {
  tls { issuer acme { dir https://acme.zerossl.com/v2/DV90; email admin@finalclass.net } }
  reverse_proxy localhost:6000
}
```

Port w `reverse_proxy` MUSI zgadzać się z portem w `Well.run ~port:...` (obecnie 6000). Przy zmianie portu w kodzie należy zaktualizować Caddyfile na serwerze (`ssh fcmain` + `systemctl reload caddy`).

#### Zmienne środowiskowe na serwerze
Plik `/opt/smock/.env` zawiera:
- `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` — dostęp do S3
- `SMOCK_ADMIN_KEY` — hasło seed usera admina
- `SMOCK_ADMIN_EMAIL` — email seed usera
- `AI_ACCESS_TOKEN` — Bearer token do autoryzacji requestów do serwisu ai-access (http://localhost:9720). Używany w nagłówku Authorization proxy endpointów `/api/projects/:id/ai/*`
- `ARCHEA_TOKEN` — scoped token Archea przekazywany jako `apiToken` przy tworzeniu sesji ai-access (POST /api/v1/sessions). Claude w sesji używa tego tokenu do operacji na repozytorium. Osobny od AI_ACCESS_TOKEN
- `STORAGE=s3` — wymusza użycie S3 do przechowywania plików mocków (bez tego: local filesystem `data/mock_files/`)

UWAGA: `PRODUCTION=true` NIE jest ustawione — TLS terminuje Caddy, nie Well. Zmienna `STORAGE=s3` steruje niezależnie wyborem backendu storage.

### Build

#### System budowania
Dune project: lang 3.17, dialekt MLX (preprocess mlx-pp), pin well z GitHub HTTPS. Makefile: build (dune build), check (dune build @check), test (dune test), clean (dune clean), lock (dune pkg lock), dev (source .env + dune exec -w). TS→JS: bun build ts/mock-viewer.ts, ts/smock-comments.ts, ts/smock-ai-chat.ts i well.ts, mode promote (wynik kopiowany do source tree).

#### Testy
Testy w test/smock_test.ml z Well_test. Istniejące testy: template processor (bez layoutu i z layoutem), slug generation (spacje, wielokrotne myślniki), S3 content type detection (css, html, js, png, unknown).
