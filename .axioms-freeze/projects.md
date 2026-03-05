# Zarządzanie projektami

## Aksjomaty

### CRUD projektów

#### Tworzenie projektu
[test]
Projekt tworzony przez formularz na stronie głównej (POST /projects) lub API (POST /api/projects). Wymaga nazwy (name). System automatycznie generuje token (8 znaków) i api_key (32 znaki hex). created_at ustawiane na aktualny czas UTC (ISO 8601). user_id przypisywane do zalogowanego usera (admin) lub usera z kontekstu API.

#### Lista projektów
Strona główna (GET /) pokazuje projekty należące do zalogowanego usera (Project_access.list_by_user). Każdy projekt wyświetla: nazwę (link do szczegółów), token, datę utworzenia, link do widoku klienckiego (/p/:token).

#### Szczegóły projektu
Strona szczegółów projektu (GET /projects/:id) wyświetla: nazwę, token, api_key, URL kliencki (/p/:token), listę moków z ich statusami i akcjami (zmiana statusu, usunięcie, link do podglądu). Dostępna tylko dla właściciela (ensure_project_owner).

#### Usunięcie projektu
Usunięcie projektu (POST /projects/:id/delete) kasuje kaskadowo wszystkie moki projektu (wraz z plikami na S3 i rekordami mock_files) i sam projekt. Wymaga potwierdzenia właściciela.

### Implementacja ProjectAccess

#### ProjectAccess — warstwa dostępu do SQLite
[test]
Implementacja ProjectAccess (project_access_impl.ml) używa `[@@deriving table ~name:"projects"]` do tworzenia tabeli i `let%query` do SQL. Moduł Impl implementuje interfejs Project_access.IMPL. Funkcja assign_orphans aktualizuje projekty z user_id=0 do podanego user_id. Spec rejestrowany w app.ml przez Well.Service.register.
