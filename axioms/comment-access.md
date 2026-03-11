# CommentAccess

CommentAccess — warstwa dostępu do SQLite dla wątków i komentarzy.

[test]
Implementacja CommentAccess (comment_access_impl.ml) obsługuje dwie tabele: `threads` i `comments`.

Operacje na wątkach:
- list_threads_by_mock (MockReq → ThreadList) — SELECT threads z komentarzami dla danego mocka, ORDER BY id DESC. Każdy thread zawiera zagnieżdżoną listę comments.
- create_thread (CreateThreadReq → Thread) — atomowo: INSERT thread + INSERT pierwszy comment. Zwraca thread z komentarzami.
- resolve_thread (IdReq → Thread) — UPDATE SET resolved=1 na wątku.
- delete_thread (IdReq → Ok) — DELETE thread (CASCADE na comments).

Operacje na komentarzach (odpowiedzi w wątku):
- add_comment (AddCommentReq → Comment) — INSERT comment do istniejącego wątku.

Konwersja resolved: int w bazie (0/1) → bool w typie Thread.t.
