---
name: well
description: Use when building features, pages, routes, LiveViews, models, or services in a well framework application. Covers MLX syntax, route registration, LiveView patterns, type-safe SQL, contracts, and project conventions.
user-invocable: true
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Well Framework — Comprehensive Reference

You are generating code for a **well** application — a batteries-included, type-safe, server-first OCaml web framework. Single binary deployment, no JavaScript for business logic. Inspired by Phoenix LiveView, Rails, and the OCaml ecosystem.

**Tech stack**: OCaml 5.4 + EIO (fiber-per-connection), MLX for JSX, SQLite (bundled), dune 3.17, bun (frontend assets).

## File Extensions

- `.ml` — pure OCaml (models, queries, logic, services)
- `.mlx` — OCaml + JSX (pages, components, layouts)

---

## MLX Syntax (CRITICAL)

MLX is JSX for OCaml. Children inside JSX tags follow OCaml `simple_expr` grammar:

```ocaml
(* CORRECT *)
<div>"literal string"</div>
<div>variable_name</div>
<div>(txt "hello")</div>
<div>(string_of_int count)</div>
<div>(if cond then <span>"yes"</span> else <span>"no"</span>)</div>
<Tag prop="value" prop2=variable />

(* WRONG — these are ALL syntax errors *)
<div>{txt "hello"}</div>     (* {..} is record syntax only! *)
<div>{string_of_int x}</div> (* use parentheses instead *)
<div>{42}</div>              (* not expression interpolation *)
```

Rules:
- `"string"` — literal string child
- `identifier` — bare variable
- `(expr)` — parenthesized expression for function calls, operators, anything complex
- `{...}` — record expression ONLY (e.g. `{name; age}`) — NOT for interpolation

### MLX Common Pitfalls

- **No `empty` node** — use `(txt "")` when you need to render nothing (e.g. in else branches)
- **`textarea` children must be `node`** — use `<textarea>(txt value)</textarea>`, NOT `<textarea>value</textarea>` (bare variable is string, not node) and NOT `<textarea>"default"</textarea>` (literal string is also not node)
- **All attribute values are strings** — use `value=(string_of_int n)` for numbers
- **`_` suffix for OCaml keywords** — `class_`, `type_`, `method_`, `name_`, `for_`

---

## HTML Library (well.html)

Module `Html` — `(wrapped false)`, imported directly.

### Core Types & Functions

```ocaml
type node = [ `Html of string ]  (* coerces to Well.response via :> *)

val txt : string -> node        (* escaped text — safe *)
val raw : string -> node        (* raw HTML — unescaped, use with care *)
val escape_html : string -> string
val cat : node list -> string   (* concatenate nodes to string *)
val element_to_string : node -> string
```

### Tag Functions

All tag functions share the same optional labeled parameters:

**String attributes** (default `""`):
- **Global**: `?id`, `?class_`, `?lang`, `?title`, `?style`, `?role`, `?tabindex`, `?dir`
- **LiveView**: `?data_lv_click`, `?data_lv_submit`, `?data_lv_change`, `?data_lv_debounce`, `?data_lv_throttle`, `?data_lv_hook`, `?data_lv_navigate`, `?data_lv_patch`
- **Link**: `?href`, `?target`, `?rel`, `?download`
- **Media**: `?src`, `?alt`, `?width`, `?height`, `?loading`, `?srcset`, `?sizes`, `?poster`, `?preload`, `?crossorigin`, `?integrity`
- **Form**: `?action`, `?method_`, `?type_`, `?placeholder`, `?value`, `?name_`, `?enctype`, `?accept`, `?for_`, `?autocomplete`, `?min`, `?max`, `?step`, `?pattern`, `?maxlength`, `?minlength`, `?rows`, `?cols`, `?wrap`, `?size`, `?formaction`, `?formmethod`
- **Meta**: `?charset`, `?content`, `?http_equiv`, `?media`
- **Table**: `?colspan`, `?rowspan`, `?scope`
- **Other**: `?datetime`, `?start`

**Boolean attributes** (default `false`):
`?hidden`, `?disabled`, `?readonly`, `?required`, `?checked`, `?selected`, `?multiple`, `?autofocus`, `?novalidate`, `?open_`, `?defer`, `?async_`, `?autoplay`, `?controls`, `?loop`, `?muted`, `?draggable`, `?reversed`

**Escape hatch** for `aria-*`, `data-*`, and any unlisted attributes:
- `?attrs:(string * string) list` — extra string attributes
- `?bool_attrs:string list` — extra boolean attributes

```ocaml
<button
  ~attrs:[("aria-label", "Close"); ("data-tooltip", "Dismiss")]
  ~bool_attrs:["data-lv-ignore"; "aria-expanded"]
  data_lv_click="close">"X"</button>
```

**All tags** (full HTML5 coverage):
- **Document**: `html`, `head`, `title`, `body`, `base`
- **Sections**: `main`, `header`, `footer`, `nav`, `section`, `article`, `aside`, `address`
- **Headings**: `h1`–`h6`
- **Grouping**: `div`, `p`, `pre`, `blockquote`, `figure`, `figcaption`, `hr`, `br`, `wbr`
- **Lists**: `ul`, `ol`, `li`, `dl`, `dt`, `dd`
- **Inline**: `span`, `a`, `strong`, `em`, `b`, `i`, `u`, `s`, `small`, `mark`, `del`, `ins`, `sub`, `sup`, `abbr`, `time`, `cite`, `q`, `dfn`, `var`, `samp`, `kbd`, `code`, `data`, `ruby`, `rt`, `rp`, `bdi`, `bdo`
- **Tables**: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`, `colgroup`, `col`
- **Forms**: `form`, `button`, `input`, `label`, `textarea`, `select`, `option`, `optgroup`, `fieldset`, `legend`, `datalist`, `output`, `progress`, `meter`
- **Interactive**: `details`, `summary`, `dialog`
- **Media**: `img`, `video`, `audio`, `source`, `track`, `canvas`, `picture`, `iframe`, `embed`, `object_`, `map`, `area`
- **Metadata**: `meta`, `link`, `script`, `noscript`, `template`, `slot`

**Void elements** (self-closing): `input`, `img`, `br`, `hr`, `meta`, `link`, `source`, `track`, `embed`, `col`, `area`, `wbr`, `base`

### Form Helpers

```ocaml
val csrf_input : string -> node
(* Generates: <input type="hidden" name="_csrf_token" value="token" /> *)

val field_error : (string * string) list -> string -> node
(* Renders error message for a form field if present in errors list *)
```

### LiveView Rendering Helpers

```ocaml
val each : id:string -> ?tag_name:string -> 'a list -> key:('a -> string) -> ('a -> node) -> node
(* Keyed list rendering with automatic diffing *)
(* each ~id:"items" items ~key:(fun i -> string_of_int i.id) (fun i -> <div>...</div>) *)
(* Default tag_name is "div". Container gets data-lv-each="id" *)
```

---

## Project Structure

```
myapp/
├── bin/main.ml                         # Entry point → App.run ()
├── lib/
│   ├── app.ml                          # Middleware, services, routes, Well.run ()
│   ├── events.ml                       # Typed pub/sub topics
│   ├── note_access/note_access_impl.ml # ResourceAccess service impl
│   ├── client/
│   │   ├── widgets/layout.mlx          # Layout component
│   │   ├── pages/home_page.mlx         # Routes: Well.get "/" ...
│   │   ├── live/counter_live.mlx       # LiveView module
│   │   └── request_id.ml              # Request ID context middleware
│   └── contract/                       # Service contracts (TOML)
├── static/                             # CSS, JS, assets
└── test/myapp_test.ml                  # Tests
```

The app library uses `(include_subdirs unqualified)` and `(wrapped false)` — every `.ml`/`.mlx` file is a top-level module (e.g. `Layout`, `Counter_live`).

---

## Core Types

```ocaml
type request = {
  meth : string;
  path : string;
  headers : (string * string) list;
  body : string;
  params : (string * string) list;  (* path params *)
  query : (string * string) list;   (* query string *)
  session_id : string;
  _context : (int * Obj.t) list;    (* typed context storage *)
}

type response = [
  | `Null | `Bool of bool | `Int of int | `Float of float
  | `String of string | `Intlit of string
  | `List of Yojson.Safe.t list | `Assoc of (string * Yojson.Safe.t) list
  | `Html of string | `Text of string | `Redirect of string
  | `Custom of custom | `Stream of stream_config
]

type handler = request -> response
type middleware = handler -> handler

type uploaded_file = { filename: string; content_type: string; size: int; data: string }
type fetch_response = { status: int; headers: (string * string) list; body: string }
```

---

## Routing

### Route Registration

```ocaml
Well.get  : ?middleware:middleware list -> string -> (request -> [< response]) -> unit
Well.post : ?middleware:middleware list -> string -> (request -> [< response]) -> unit
Well.put  : ?middleware:middleware list -> string -> (request -> [< response]) -> unit
Well.delete : ?middleware:middleware list -> string -> (request -> [< response]) -> unit
Well.ws   : string -> (request -> Websocket.t -> unit) -> unit
```

Path params via `:param` segments: `"/users/:id"`.
Wildcard `*name` as last segment catches the rest of the URL:
`"/files/*path"` → `Well.param req "path"` = `"a/b/c"`.
`*` must be the last segment (e.g. `"/api/*rest/foo"` is invalid).
Routes matched in registration order. No match → 404. Handler exception → 500.

### Route Scoping

```ocaml
Well.scope : ?middleware:middleware list -> string -> (unit -> unit) -> unit

(* Groups routes under a prefix with shared middleware *)
Well.scope ~middleware:[Well.require_auth ()] "/admin" (fun () ->
  Well.get "/dashboard" @@ fun req -> (* /admin/dashboard *) ...;
  Well.get "/users" @@ fun req -> (* /admin/users *) ...
)
```

### Response Constructors & Transformers

```ocaml
Well.html : string -> response
Well.text : string -> response
Well.json : Yojson.Safe.t -> response
Well.redirect : string -> response
Well.stream : ?content_type:string -> ?status:int -> ?headers:(string*string) list
           -> ((string -> unit) -> unit) -> response

(* Pipeable transformers — wrap in `Custom *)
Well.status : int -> response -> response
Well.header : string -> string -> response -> response

(* Stream a file with chunked transfer *)
Well.stream_file : ?content_type:string -> ?headers:(string*string) list -> string -> response
```

Response types coerce automatically:
- `Html.node` — `<div>...</div>` (text/html)
- `` `Text "..." `` or `Well.text "..."` (text/plain)
- `` `Assoc [...] `` or `Well.json (...)` (application/json)
- `Well.redirect "/path"` (302)
- Pipeline: `<div/> |> Well.status 201 |> Well.header "X-Custom" "val"`

### Request Helpers

```ocaml
Well.param : request -> string -> string             (* path param, "" if missing *)
Well.query : request -> string -> string option      (* query param *)
Well.form  : request -> string -> string             (* form field, "" if missing *)
Well.form_params : request -> (string * string) list (* all form fields *)
Well.file  : request -> string -> uploaded_file option (* single file upload *)
Well.files : request -> string -> uploaded_file list   (* multiple files *)
Well.all_files : request -> (string * uploaded_file) list
Well.request_id : request -> string                  (* unique request ID *)
Well.csrf_token : request -> string                  (* CSRF token for forms *)
Well.current_user : request -> string option         (* user_id from session *)
```

### Static Files

```ocaml
Well.static "/static" "static"
(* Serves files from "static/" dir at /static/* URL prefix *)
(* Auto-detects MIME type from extension *)
```

### Examples

```ocaml
(* Simple page *)
Well.get "/about" @@ fun _req ->
let open Html in
<Layout title="About">
  <h1>(txt "About")</h1>
</Layout>

(* JSON API with path params *)
Well.get "/users/:id" @@ fun req ->
let id = Well.param req "id" in
Well.json (`Assoc [("id", `String id)])

(* Form handling *)
Well.post "/items" @@ fun req ->
let name = Well.form req "name" in
(* ... process ... *)
Well.redirect "/items"

(* Wildcard catch-all *)
Well.get "/files/*path" @@ fun req ->
let path = Well.param req "path" in  (* "docs/readme.txt" *)
serve_file path

(* Per-route middleware *)
Well.get ~middleware:[Well.require_auth ()] "/admin" @@ fun req -> ...

(* Streaming response *)
Well.get "/export" @@ fun _req ->
Well.stream ~content_type:"text/csv" (fun write ->
  write "id,name\n";
  List.iter (fun row -> write (format_csv row)) rows)
```

---

## Layout Component

```ocaml
(* layout.mlx *)
let createElement ?title:(page_title = "") ?(children = []) () =
  let open Html in
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>(txt page_title)</title>
      <link rel="stylesheet" href="/static/app.css" />
    </head>
    <body>
      <main>(children |> cat |> raw)</main>
      <script type_="module" src="/static/well.js" />
    </body>
  </html>
```

Use in pages: `<Layout title="My Page"><h1>(txt "Hello")</h1></Layout>`

---

## LiveView — Server-Side Reactive UI

Elm architecture: model -> update -> view. All state on server, updates via WebSocket.

### VIEW Module Type

Every LiveView module must satisfy this interface:

```ocaml
module type VIEW = sig
  type model
  type msg

  val persistence : persistence      (* Ephemeral | Session | User *)
  val subscriptions : string list    (* MessageBus channels to auto-subscribe *)

  val init : request -> Yojson.Safe.t -> model
  val update : request -> model -> msg -> model
  val handle_params : request -> model -> model  (* URL query param changes *)
  val view : model -> Html.node
  val temporary_assigns : model -> model  (* reset data after each render *)

  (* Required — generated by [@@deriving yojson] *)
  val model_to_yojson : model -> Yojson.Safe.t
  val model_of_yojson : Yojson.Safe.t -> (model, string) result
  val msg_of_yojson : Yojson.Safe.t -> (msg, string) result
end
```

**Persistence modes**:
- `Ephemeral` — fresh state per connection
- `Session` — in-memory per session (survives reconnect, 5 min timeout)
- `User` — SQLite per user (survives restart, syncs across devices)

### Complete LiveView Example

```ocaml
(* counter_live.mlx *)
type model = { count: int } [@@deriving yojson]
type msg = Increment | Decrement | Reset [@@deriving yojson]

let persistence = Well.LiveView.Ephemeral
let subscriptions = []

let init _req _props = { count = 0 }

let update _req model = function
  | Increment -> { count = model.count + 1 }
  | Decrement -> { count = model.count - 1 }
  | Reset -> { count = 0 }

let handle_params _req model = model
let temporary_assigns model = model

let view model =
  let open Html in
  <div>
    <span>(txt (string_of_int model.count))</span>
    <button data_lv_click="Increment">(txt "+")</button>
    <button data_lv_click="Decrement">(txt "-")</button>
  </div>
```

### Registration & Embedding

**Two steps to create a LiveView page:**

**Step 1.** Register the LiveView module in `lib/app.ml`:
```ocaml
Well.live "/counter" (module Counter_live)
```
This registers `Counter_live` in the WS view registry under endpoint `"/live/counter"`.
It does NOT create a GET route — you must create the page yourself.

**Step 2.** Create a GET page that embeds the LiveView using MLX JSX:
```ocaml
(* lib/client/pages/counter_page.mlx *)
Well.get "/counter" @@ fun _req ->
  let open Html in
  <Layout title="Counter">
    <div>
      <h1>(txt "Counter")</h1>
      <Well.LiveView name="counter" />
    </div>
  </Layout>
```

`<Well.LiveView name="counter" />` renders a `<live-view data-liveview="/live/counter">` custom element.
The `name` becomes the endpoint path: `"/live/" ^ name`.

With props (passed to `init` as `Yojson.Safe.t`):
```ocaml
<Well.LiveView name="counter" props=[("initial", "10"); ("step", "5")] />
```

Multiple LiveViews on one page:
```ocaml
<Well.LiveView name="counter" />
<Well.LiveView name="activity_log" />
```

**How it works under the hood:**
1. `Well.live "/counter" (module M)` registers `M` under endpoint `"/live/counter"`
2. `<Well.LiveView name="counter" />` renders `<live-view data-liveview="/live/counter">`
3. Client JS discovers `<live-view>` elements on page load
4. Client connects via WebSocket to `/live` and sends `join` for each endpoint
5. Server sends initial HTML (`full`), then incremental binary patches on each `msg`

**IMPORTANT**: `Well.live` does NOT create a GET route. You MUST create a page
with `Well.get` and embed `<Well.LiveView name="..." />` inside it.
The `name` must match the path from `Well.live` (without leading `/`).
```

### LiveView Attributes

| Attribute | Description | Wire format |
|-----------|-------------|-------------|
| `data_lv_click="Msg"` | Click sends msg (no args) | `["Msg"]` |
| `data_lv_click={|["Msg","val"]|}` | Click with payload (JSON array in attr) | `["Msg", "val"]` |
| `data_lv_submit="Msg"` | Form submit (fields as object) | `["Msg", {field: value, ...}]` |
| `data_lv_change="Msg"` | Input change (single value) | `["Msg", input_value]` |
| `data_lv_debounce="300"` | Debounce (ms) | — |
| `data_lv_throttle="300"` | Throttle (ms) | — |
| `data_lv_navigate="/path"` | Live navigation (pushState) | — |
| `data_lv_patch="/path?q=x"` | Update query params only | — |
| `data_lv_hook="HookName"` | Attach JS hook | — |

### Variant encoding (ppx_deriving_yojson)

- `Increment` → `["Increment"]` (JSON array, NOT string)
- `SetValue of int` → `["SetValue", 42]`
- `SubmitForm of { name: string; email: string }` → `["SubmitForm", {"name": "...", "email": "..."}]`
- `` `Incremented (s, n) `` → `["Incremented", "s", 42]`

### Click with payload

`data_lv_click` tries `JSON.parse` on the attribute value. If it parses as an array, it's sent as-is.
Otherwise the string is wrapped in `["string"]`.

```ocaml
(* No payload — simple variant *)
<button data_lv_click="Increment">(txt "+")</button>
(* sends: ["Increment"] *)

(* With payload — encode JSON array in attribute *)
<button data_lv_click=(Printf.sprintf {|["SetPage", "%s"]|} (Html.escape_html page))>
  (txt page)
</button>
(* sends: ["SetPage", "cennik.html"] → decoded as: SetPage "cennik.html" *)

(* Static payload *)
<button data_lv_click={|["SelectTab", "settings"]|}>(txt "Settings")</button>
```

### Form submissions (`data_lv_submit`)

The client collects all form inputs into a JSON object and sends `["MsgName", {"field1": "value1", ...}]`.
Use **inline record variants** for form messages — ppx_deriving_yojson decodes them correctly:

```ocaml
(* CORRECT — inline record matches form JSON {"author":"...","body":"..."} *)
type msg =
  | Increment
  | SubmitComment of { author: string; body: string }
[@@deriving yojson]

(* WRONG — tuple variant expects ["SubmitComment", "v1", "v2"] but form sends object *)
type msg = SubmitComment of string * string [@@deriving yojson]
```

Input `name` attributes must match record field names:
```ocaml
<form data_lv_submit="SubmitComment">
  <input type_="text" name_="author" placeholder="Name" />
  <textarea name_="body">(txt "")</textarea>
  <button type_="submit">(txt "Send")</button>
</form>
```

### View Rendering

The `view` function returns HTML that is morphed into the DOM on each update.
No annotation required — structural changes (if/else, conditional elements) are
handled automatically by the client-side morphdom algorithm.

```ocaml
(* Conditional rendering — works fine *)
let view model =
  let open Html in
  <div>
    (if model.items = [] then
      <p>(txt "Nothing here")</p>
    else
      <div class_="list">
        (each ~id:"items" model.items
          ~key:(fun item -> string_of_int item.id)
          (fun item -> ...))
      </div>)
  </div>
```

Tips:
1. Use `data-lv-key` or `id` on list items for stable element matching
2. Use `data-lv-ignore` to skip morphing on specific elements
3. Focused form inputs preserve their value during morphing

### LiveView with Subscriptions (Cross-View Communication)

```ocaml
(* activity_log_live.mlx — subscribes to events from other LiveViews *)
type model = { entries: string list } [@@deriving yojson]
type msg = Events.counter_event [@@deriving yojson]  (* reuse event type *)

let subscriptions = [Well.topic_name Events.counter_event]

let update _req model = function
  | `Incremented (_, n) -> { entries = (Printf.sprintf "+%d" n) :: model.entries }
  | `Reset -> { entries = "reset" :: model.entries }
  | _ -> model
```

### Server Push to Hooks

```ocaml
(* Push event from server to a JS hook *)
Well.LiveView.send_event "topic" "event_name" (`Assoc [("key", `String "val")])
```

### JS Hooks

```javascript
// In your JS — hooks run client-side
Well.hooks.Chart = {
  mounted() {
    this.handleEvent("update", (data) => {
      renderChart(this.el, data);
    });
  },
  updated() { /* DOM was patched */ },
  destroyed() { /* element removed */ }
};
```

### LiveView Uploads

```ocaml
(* MLX: file input with hook *)
<input type_="file" data_lv_hook="FileUpload" />

(* Server side: consume uploaded file *)
match Well.LiveView.consume_upload upload_id with
| Some (filename, content_type, data) -> Well.write_file ("data/" ^ filename) data
| None -> ()
```

### LiveView Search/Filter Example

```ocaml
(* lib/client/live/search_live.mlx — the LiveView module *)
(* Then register: Well.live "/search" (module Search_live) in app.ml *)
(* And create page: Well.get "/search" with <Well.LiveView name="search" /> *)
type item = { id: int; name: string } [@@deriving yojson]
type model = { query: string; results: item list; empty_msg: string } [@@deriving yojson]
type msg = Search of string [@@deriving yojson]

let persistence = Well.LiveView.Ephemeral
let subscriptions = []

let make_model query =
  let results = search query in
  { query; results; empty_msg = if results = [] then "No results" else "" }

let init _req _props = make_model ""
let update _req _model = function Search q -> make_model q
let handle_params _req model = model
let temporary_assigns model = model

let view model =
  let open Html in
  <div>
    <input type_="text" placeholder="Search..."
      value=model.query data_lv_change="Search" data_lv_debounce="300" />
    <p>(txt model.empty_msg)</p>
    <div>(each ~id:"results" model.results
      ~key:(fun r -> string_of_int r.id)
      (fun r -> <div><span>(txt r.name)</span></div>))</div>
  </div>
```

---

## Type-Safe SQL (well.ppx)

Write normal SQL. Compiler validates it at build time using registered table schemas. No database connection needed at compile time.

### Define Models

```ocaml
type note = {
  id : int;
  title : string;
  body : string;
  active : bool;
  score : float option;  (* nullable column *)
} [@@deriving table ~name:"notes"]
```

`[@@deriving table]` generates:
- `CREATE TABLE IF NOT EXISTS` SQL
- Schema registration for compile-time validation
- Auto-migration: `Well.Db.open_db ()` creates tables + adds new columns

Type mapping: `int`→INTEGER, `float`→REAL, `string`→TEXT, `bool`→INTEGER, `'a option`→nullable

### Define Queries

```ocaml
let%query all_notes = "SELECT id, title, body FROM notes ORDER BY id DESC"
let%query insert_note = "INSERT INTO notes (title, body) VALUES (:title, :body)"
let%query find_note = "SELECT id, title, body FROM notes WHERE id = :id"
let%query delete_note = "DELETE FROM notes WHERE id = :id"
let%query search_notes = "SELECT id, title FROM notes WHERE title LIKE :q"
let%query update_note = "UPDATE notes SET title = :title, body = :body WHERE id = :id"
```

**Generated code**:

For SELECT → module with `type row` + `query`:
```ocaml
module All_notes : sig
  type row = { id: int; title: string; body: string }
  val sql : string
  val query : Sqlite3.db -> row list
end

module Find_note : sig
  type row = { id: int; title: string; body: string }
  val sql : string
  val query : Sqlite3.db -> id:string -> row list  (* :param → ~param labeled arg *)
end
```

For INSERT/UPDATE/DELETE → module with `exec`:
```ocaml
module Insert_note : sig
  val sql : string
  val exec : Sqlite3.db -> title:string -> body:string -> unit
end
```

### Database Access Pattern

```ocaml
(* notes.ml — standard pattern *)
type note = { id: int; title: string; body: string } [@@deriving table ~name:"notes"]
let%query all = "SELECT id, title, body FROM notes ORDER BY id DESC"
let%query insert = "INSERT INTO notes (title, body) VALUES (:title, :body)"

let db = lazy (Well.Db.open_db ())
let get_db () = Lazy.force db
```

Usage:
```ocaml
let db = Notes.get_db () in
let notes = Notes.All.query db in
Notes.Insert.exec db ~title:"Hello" ~body:"World";
```

### Well.Db Module

```ocaml
Well.Db.open_db : ?filename:string -> unit -> Sqlite3.db
(* Opens SQLite in data/ dir, runs auto_migrate. Default filename: "app.sqlite" *)

Well.Db.with_test_db : (Sqlite3.db -> 'a) -> 'a
(* Opens :memory: SQLite, runs auto_migrate, perfect for tests *)

Well.Db.transaction : Sqlite3.db -> (Sqlite3.db -> 'a) -> 'a
Well.Db.transaction_result : Sqlite3.db -> (Sqlite3.db -> ('a, string) result) -> ('a, string) result

Well.Db.table_exists : Sqlite3.db -> string -> bool
Well.Db.diff : Sqlite3.db -> diff_entry list  (* pending migrations *)
Well.Db.auto_migrate : Sqlite3.db -> unit      (* run manually if needed *)
Well.Db.backup : string -> unit                (* backup db file *)
Well.Db.rollback : string -> unit              (* restore from .bak *)

Well.Db.data_dir : string ref  (* default "data", set before open_db *)
```

---

## Typed Pub/Sub (Well.MessageBus)

Single unified pub/sub system. SQLite-backed (persistent by default), in-memory (ephemeral).

### Typed Topics

```ocaml
(* types *)
type 'a topic = { t_channel: string; to_yojson: ...; of_yojson: ... }
type 'a event = { id: int; value: 'a; created_at: float }
type 'a keyed_event = { key: string; event: 'a event }
```

### Define Topics with PPX

```ocaml
(* events.ml *)
type counter_event = [`Incremented of string * int | `Decremented of string * int | `Reset]
[@@deriving yojson, topic]
(* Generates: val counter_event : counter_event topic *)
(* Channel name defaults to type name: "counter_event" *)

type echo_cmd = { text: string } [@@deriving yojson, topic ~name:"echo:cmd"]
(* Custom channel name: "echo:cmd" *)
```

**Requires** `[@@deriving yojson]` on same type (explicit, not auto-added).

### Core Pub/Sub API

```ocaml
Well.topic : string -> ('a -> Yojson.Safe.t) -> (Yojson.Safe.t -> ('a, string) result) -> 'a topic
Well.topic_name : 'a topic -> string

Well.publish : ?ephemeral:bool -> 'a topic -> 'a -> unit
(* Default: persistent (stored in SQLite). ephemeral: in-memory only *)

Well.subscribe : ?live_only:bool -> 'a topic -> ('a event -> unit) -> int
(* Returns subscription id. live_only: skipped during replay *)

Well.replay : ?since_id:int -> 'a topic -> ('a event -> unit) -> unit
(* Replays stored events from SQLite *)

Well.is_replaying : unit -> bool
Well.prune : int -> unit  (* delete old events *)
```

### Keyed Topics (channel:key)

For dynamic channels with UUIDs (e.g. command sourcing):

```ocaml
Well.publish_keyed : ?ephemeral:bool -> 'a topic -> key:string -> 'a -> unit
(* Publishes to "channel:key" *)

Well.subscribe_keyed : ?live_only:bool -> 'a topic -> ('a keyed_event -> unit) -> int
(* Subscribes to "channel:*", callback receives { key; event } *)
```

### Request/Reply Pattern

```ocaml
Well.request : cmd:'a topic -> reply:'b topic -> key:string -> ?timeout:float -> 'a -> 'b
(* Blocks fiber (not thread), default timeout 5s, raises Well.Request_timeout *)
```

Example:
```ocaml
(* events.ml *)
type order_cmd = { items: string list } [@@deriving yojson, topic ~name:"order:cmd"]
type order_result = { order_id: string } [@@deriving yojson, topic ~name:"order:result"]

(* Manager subscribes to all commands *)
Well.subscribe_keyed Events.order_cmd (fun kev ->
  let cmd = kev.event.value in
  let result = process cmd in
  Well.publish_keyed ~ephemeral:true Events.order_result ~key:kev.key result)

(* HTTP endpoint sends command, awaits response *)
Well.post "/orders" @@ fun req ->
let key = generate_uuid () in
let result = Well.request ~cmd:Events.order_cmd ~reply:Events.order_result
               ~key { items = ["x"] } in
Well.json (order_result_to_yojson result)
```

### Replay Safety

```ocaml
(* Always runs — cross-Manager state update *)
Well.subscribe_keyed Events.order_cmd (fun kev -> process kev.event.value)

(* Only runs live — external side effect (skipped during replay) *)
Well.subscribe ~live_only:true Events.order_event (fun evt ->
  External_api.sync evt.value)
(* All publish calls during replay are automatically ephemeral *)
```

### LiveView Subscriptions

```ocaml
(* In LiveView module — auto-subscribes to channels *)
let subscriptions = [Well.topic_name Events.counter_event]
type msg = Events.counter_event [@@deriving yojson]
(* Events arrive as msg in update function *)
```

### Low-Level MessageBus (Untyped)

```ocaml
Well.MessageBus.publish : ?ephemeral:bool -> string -> Yojson.Safe.t -> int
Well.MessageBus.subscribe : ?live_only:bool -> string -> (event -> unit) -> int
(* Supports wildcard: "orders/*" matches "orders/new", "orders/cancel" *)
Well.MessageBus.unsubscribe : int -> unit
Well.MessageBus.once : string -> (event -> unit) -> int  (* auto-unsubscribe after first *)
Well.MessageBus.replay : ?since_id:int -> string -> (event -> unit) -> unit
```

---

## Channels — Authorized WS Gateway

Client-facing WebSocket pub/sub with authorization. Runs on `/ws`.

```ocaml
Well.Channel.channel : string -> (request -> string -> (join_result, string) result) -> unit

(* Example: authorize room access *)
Well.Channel.channel "room:*" (fun req topic ->
  match Well.current_user req with
  | Some _ -> Ok { subscribe = [topic] }
  | None -> Error "unauthorized")
```

Client-side (TypeScript):
```javascript
const ch = well.channel("room:general");
ch.on("message", (payload) => console.log(payload));
ch.push("send", { text: "hello" });
ch.leave();
```

WS protocol: `join/leave/push` (C→S), `ok/error/event` (S→C).

---

## Middleware

### Built-in Middleware

```ocaml
Well.use : middleware -> unit  (* register global middleware *)

(* Available middleware *)
Well.error_handler : middleware    (* catches exceptions, returns 500 *)
Well.logger : middleware           (* request logging *)
Well.csrf : middleware             (* CSRF token validation *)
Well.session_middleware : middleware (* session cookie management — auto-registered *)

Well.rate_limit : max_requests:int -> window_ms:int -> unit -> middleware
Well.cors : ?origins:string list -> ?methods:string list -> ?headers:string list
         -> ?max_age:int -> unit -> middleware
Well.require_auth : ?login_path:string -> unit -> middleware  (* redirects to login *)
Well.basic_auth : check:(string -> string -> bool) -> ?realm:string -> unit -> middleware
Well.allowed_hosts : hosts:string list -> unit -> middleware
Well.secure_headers : ?csp:string -> ?frame_options:string -> ?content_type_options:string
                   -> ?referrer_policy:string -> ?hsts:string -> unit -> middleware
```

### Custom Middleware

```ocaml
Well.use (fun next req ->
  (* before handler *)
  let resp = next req in
  (* after handler *)
  resp)
```

### Per-Route and Scoped Middleware

```ocaml
(* Per-route *)
Well.get ~middleware:[Well.require_auth ()] "/admin" @@ fun req -> ...

(* Scoped *)
Well.scope ~middleware:[Well.require_auth ()] "/admin" (fun () ->
  Well.get "/dashboard" @@ fun req -> ...;
  Well.get "/settings" @@ fun req -> ...
)
```

---

## Sessions

SQLite-backed, thread-safe session store.

```ocaml
Well.session_get : request -> string -> string option
Well.session_set : request -> string -> string -> unit
Well.session_delete : request -> string -> unit
Well.session_clear : request -> unit
Well.session_regenerate : request -> (request * (response -> response))
(* Returns new request + response transformer that sets new cookie *)
```

### Flash Messages

```ocaml
Well.put_flash : request -> string -> string -> unit
Well.get_flash : request -> string -> string option

(* Usage *)
Well.put_flash req "success" "Item created!";
let msg = Well.get_flash req "success"  (* string option *)
```

---

## Request Context (Well.Context)

Type-safe, per-request context via functor. Each context type gets a unique slot.

```ocaml
module type CONTEXT = sig
  type t
  val empty : t
end

module Ctx = Well.Context(struct
  type t = string
  let empty = ""
end)

(* In middleware: set *)
let middleware : Well.middleware = fun next req ->
  next (Ctx.set "value" req)

(* In handler: get *)
let value = Ctx.get req
```

---

## Auth (Well.Auth) — Password-Based Authentication

PBKDF2-SHA256, 100k iterations. Stored in `data/well.sqlite`.

```ocaml
type user = { id: int; email: string; created_at: string }

(* User management *)
Well.Auth.register : email:string -> password:string -> (user, string) result
Well.Auth.login : email:string -> password:string -> (user, string) result
Well.Auth.get_user : int -> user option

(* Session integration *)
Well.Auth.login_and_set_session : request -> email:string -> password:string -> (user, string) result
Well.Auth.logout : request -> unit

(* Grants — flat permission system *)
Well.Auth.grant : user_id:int -> string -> unit
Well.Auth.revoke : user_id:int -> string -> unit
Well.Auth.has_grant : user_id:int -> string -> bool
Well.Auth.user_grants : user_id:int -> string list

(* Handler wrapper — checks grant, raises Auth_denied *)
Well.Auth.require_grant : string -> (request -> 'a) -> (request -> 'a)
```

Example:
```ocaml
(* Login page *)
Well.post "/login" @@ fun req ->
let email = Well.form req "email" in
let password = Well.form req "password" in
match Well.Auth.login_and_set_session req ~email ~password with
| Ok _user -> Well.redirect "/"
| Error msg -> render_login_page ~error:msg

(* Logout *)
Well.post "/logout" @@ fun req ->
  Well.Auth.logout req;
  Well.redirect "/login"

(* Protected route with grant check *)
Well.get "/admin" @@ Well.Auth.require_grant "admin" (fun req -> ...)

(* Check current user in handler *)
let user_id = Well.current_user req  (* reads "user_id" from session *)
```

---

## OAuth (Well.OAuth) — Social Login

OAuth 2.0 with PKCE for Google, GitHub, Microsoft, Facebook. Stored in `data/well.sqlite` (_well_oauth_identities table).

```ocaml
type provider_config

(* Pre-configured providers *)
Well.OAuth.google    : client_id:string -> client_secret:string -> provider_config
Well.OAuth.github    : client_id:string -> client_secret:string -> provider_config
Well.OAuth.microsoft : client_id:string -> client_secret:string -> provider_config
Well.OAuth.facebook  : client_id:string -> client_secret:string -> provider_config

(* Setup — registers /auth/:provider and /auth/:provider/callback routes *)
Well.OAuth.setup : base_url:string -> provider_config list -> unit

(* Query configured providers (for rendering login buttons) *)
Well.OAuth.configured_providers : unit -> string list

(* Get linked identities for a user *)
Well.OAuth.user_identities : user_id:int -> (string * string) list
```

Setup in `lib/app.ml` (reads from env vars):
```ocaml
let oauth_providers = List.filter_map Fun.id [
  (match Sys.getenv_opt "GOOGLE_CLIENT_ID", Sys.getenv_opt "GOOGLE_CLIENT_SECRET" with
   | Some id, Some secret -> Some (Well.OAuth.google ~client_id:id ~client_secret:secret)
   | _ -> None);
  (* same for GITHUB_, MICROSOFT_, FACEBOOK_ *)
] in
if oauth_providers <> [] then
  Well.OAuth.setup ~base_url:"https://myapp.com" oauth_providers;
```

Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
`MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `BASE_URL`.

Security: PKCE S256 on all providers, state bound to session (single-use, 10-min expiry, constant-time compare), session regeneration after login, verified-email-only account linking.

---

## Form Validation (Well.Form)

Applicative form validation with chainable validators.

```ocaml
type 'a t = { field: string; value: 'a option; errors: (string * string) list }

Well.Form.get : (string * string) list -> string -> string t
Well.Form.trim : string t -> string t
Well.Form.required : 'a t -> 'a t
Well.Form.min_length : int -> string t -> string t
Well.Form.max_length : int -> string t -> string t
Well.Form.format_ : string -> string t -> string t  (* regex pattern *)
Well.Form.number : string t -> int t
Well.Form.decimal : string t -> float t
Well.Form.custom : ('a -> string option) -> 'a t -> 'a t
Well.Form.validate : 'a t -> ('a, (string * string) list) result

(* Applicative operators *)
val ( let+ ) : 'a t -> ('a -> 'b) -> 'b t
val ( and+ ) : 'a t -> 'b t -> ('a * 'b) t
```

Example:
```ocaml
let open Well.Form in
let params = Well.form_params req in
let result =
  let+ title = get params "title" |> trim |> required |> min_length 3
  and+ email = get params "email" |> trim |> required |> format_ ".*@.*\\..*"
  and+ age = get params "age" |> required |> number in
  (title, email, age)
  |> validate
in
match result with
| Ok (title, email, age) -> (* process *)
| Error errors ->
  (* errors: (string * string) list — [(field_name, error_message); ...] *)
  (* Use Html.field_error errors "title" to render error messages *)
```

---

## Mailer (Well.Mailer)

Multi-adapter email system.

```ocaml
type adapter =
  | Log                                              (* prints to stdout *)
  | SMTP of { host: string; port: int; username: string; password: string }
  | Resend of { api_key: string }
  | Zeptomail of { api_url: string; token: string }
  | SES of { region: string; access_key_id: string; secret_access_key: string }

type mail = { to_: (string * string) list; subject: string; html: string; text: string }

Well.Mailer.setup : { from_email: string; from_name: string; adapter: adapter } -> unit
Well.Mailer.send : mail -> (unit, string) result
```

Example:
```ocaml
Well.Mailer.setup { from_email = "noreply@example.com"; from_name = "MyApp"; adapter = Log };

match Well.Mailer.send {
  to_ = [("User", "user@example.com")];
  subject = "Welcome!";
  html = "<h1>Hello</h1>";
  text = "Hello";
} with
| Ok () -> ()
| Error msg -> Well.log ~level:"error" "Mail error: %s" msg
```

---

## HTTP Client (Well.fetch)

```ocaml
Well.fetch : ?method_:string -> ?headers:(string*string) list -> ?body:string
          -> string -> fetch_response

(* fetch_response = { status: int; headers: (string * string) list; body: string } *)

(* GET *)
let resp = Well.fetch "https://api.example.com/data" in
Printf.printf "Status: %d\n" resp.status

(* POST with JSON body *)
let resp = Well.fetch ~method_:"POST"
  ~headers:[("Content-Type", "application/json")]
  ~body:{|{"key":"value"}|}
  "https://api.example.com/data" in
```

---

## S3 Storage (Well.S3)

AWS S3 client with Signature V4 authentication.

```ocaml
Well.S3.connect : ?endpoint_url:string -> ?region:string -> ?access_key_id:string
               -> ?secret_access_key:string -> ?bucket:string -> unit -> S3.t
(* Reads from env: AWS_ENDPOINT_URL, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET *)

Well.S3.put : S3.t -> key:string -> data:string -> (unit, string) result
Well.S3.get : S3.t -> key:string -> (string, string) result
Well.S3.delete : S3.t -> key:string -> (unit, string) result
Well.S3.list : S3.t -> prefix:string -> (string list, string) result
Well.S3.head : S3.t -> key:string -> (int, string) result  (* returns size *)
Well.S3.presigned_url : S3.t -> method_:string -> key:string -> ?expires_in_secs:int -> unit -> string
Well.S3.create_bucket : S3.t -> (unit, string) result
```

Example:
```ocaml
let s3 = Well.S3.connect ~bucket:"my-bucket" () in
match Well.S3.put s3 ~key:"photos/cat.jpg" ~data:image_data with
| Ok () -> ()
| Error msg -> failwith msg;

let url = Well.S3.presigned_url s3 ~method_:"GET" ~key:"photos/cat.jpg" ~expires_in_secs:3600 ()
```

---

## Service Contracts (TOML)

Define service interfaces in TOML, generate OCaml + TypeScript + Go + Dart.

```toml
# contract/TaskAccess.toml
[service.rpc]
list = "ListReq -> TaskList"
create = "CreateReq -> Task"

[msg.Task.struct]
id = "int"
title = "string"
completed = "bool"

[msg.ListReq.struct]
limit = "int"

[msg.CreateReq.struct]
title = "string"

[msg.TaskList.struct]
tasks = { type = "list", of = "Task" }
```

Generate: `well contract build .`

Implement:
```ocaml
module Impl : Task_access.IMPL with type state = unit = struct
  type state = unit
  let init () = ()

  let list () _ctx (req : Task_access.ListReq.t) =
    Task_access.TaskList.make ~tasks ()

  let create () _ctx (req : Task_access.CreateReq.t) =
    Task_access.Task.make ~id ~title:req.title ~completed:false ()
end

let spec = Task_access.make_spec (module Impl)
```

Register in `lib/app.ml`:
```ocaml
Well.Service.register Task_access_impl.spec;
Well.Service.expose "TaskAccess";  (* creates /rpc/TaskAccess/* HTTP routes *)
```

### Service Module

```ocaml
Well.Service.register : ?restart:restart -> spec -> unit
(* restart: Permanent (always restart) | Transient (restart on error) | Temporary (no restart) *)

Well.Service.expose : string -> unit  (* expose as HTTP RPC *)
Well.Service.list_services : unit -> (string * string list) list
Well.Service.health : unit -> (string * string) list
Well.Service.cast : (unit -> unit) -> unit  (* fire-and-forget async *)
```

---

## WebSocket (Raw)

For custom WebSocket handlers (not LiveView or Channel).

```ocaml
Well.ws "/ws/custom" (fun req ws ->
  (* ws : Websocket.t *)
  match Websocket.receive ws with
  | Some msg ->
    Websocket.send ws ("echo: " ^ msg);
    Websocket.send_json ws (`Assoc [("type", `String "ack")])
  | None -> ()  (* connection closed *)
)
```

```ocaml
Websocket.receive : t -> string option
Websocket.receive_json : t -> Yojson.Safe.t option
Websocket.send : t -> string -> unit
Websocket.send_json : t -> Yojson.Safe.t -> unit
Websocket.close : t -> unit
Websocket.is_open : t -> bool
```

---

## File I/O

```ocaml
Well.write_file : string -> string -> unit
Well.read_file : string -> string
Well.file_exists : string -> bool
Well.mkdir : string -> unit
Well.list_dir : string -> string list
Well.ext_to_mime : string -> string  (* "jpg" → "image/jpeg" *)
```

---

## Logging

```ocaml
Well.log : ?level:string -> ?ctx:(string*string) list -> ('a, unit, string) format -> 'a

Well.log "Server started on port %d" port;
Well.log ~level:"error" "Failed: %s" msg;
Well.log ~level:"debug" ~ctx:[("user_id", uid)] "Action performed";
```

Levels: `debug`, `info` (default), `warn`, `error`. Logs to stdout + `data/well.log` with rotation (10MB, 5 files).

---

## Configuration

```ocaml
Well.max_body_size : int -> unit       (* max request body *)
Well.keep_alive_timeout : float -> unit
Well.request_timeout : float -> unit
Well.ws_rate_limit : float -> unit
Well.ws_max_frame_size : int -> unit   (* default 10MB *)
Well.max_upload_size : int -> unit
Well.dev_mode : bool -> unit           (* enables dev error pages *)
Well.on_error : (exn -> request -> response) -> unit  (* custom error handler *)
```

---

## Server

```ocaml
Well.run : ?port:int -> ?workers:int -> ?cert:string -> ?key:string
        -> ?domain:string -> ?acme_staging:bool -> ?disable_cap:bool -> unit -> unit
(* Default: port 4000, listens 0.0.0.0. Blocks forever. *)
(* ~cert/~key: PEM files for manual TLS *)
(* ~domain: enables Let's Encrypt auto-TLS (mutually exclusive with cert/key) *)
(* ~acme_staging: use LE staging for testing *)
(* ~disable_cap: disable Cap admin panel *)

Well.with_test_server : ?port:int -> ?disable_cap:bool -> (int -> 'a) -> 'a
(* Starts server on random port, passes port to function *)
```

### Auto-TLS (Let's Encrypt)

```ocaml
Well.run ~domain:"myapp.example.com" ~port:443 ()
(* Automatically provisions certificate via HTTP-01 challenge *)
(* Stores certs in data/certs/ *)
```

---

## Testing

### Test Framework (Well_test)

```ocaml
open Well_test

describe : string -> (unit -> unit) -> unit
it : string -> (unit -> unit) -> unit   (* alias: test *)
skip : string -> (unit -> unit) -> unit

before_each : (unit -> unit) -> unit
after_each : (unit -> unit) -> unit
before_all : (unit -> unit) -> unit
after_all : (unit -> unit) -> unit

expect : 'a -> expectation
not_ : expectation -> expectation

(* Matchers *)
to_equal_string : string -> expectation -> unit
to_equal_int : int -> expectation -> unit
to_equal_float : ?epsilon:float -> float -> expectation -> unit
to_equal_bool : bool -> expectation -> unit
to_be_true / to_be_false : expectation -> unit
to_be_some / to_be_none : expectation -> unit
to_be_greater_than / to_be_less_than : int -> expectation -> unit
to_contain : string -> expectation -> unit       (* substring *)
to_match : string -> expectation -> unit         (* regex *)
to_have_length : int -> expectation -> unit      (* list *)
to_raise : expectation -> unit
to_raise_with : string -> expectation -> unit
to_match_snapshot : expectation -> unit          (* snapshot testing *)

run : ?filter:string option -> ?ci_mode:bool -> ?source_file:string -> unit -> run_result
exit_with_result : run_result -> unit
```

### Database Tests

```ocaml
it "creates a note" (fun () ->
  Well.Db.with_test_db (fun db ->
    Notes.Insert.exec db ~title:"Test" ~body:"Body";
    let notes = Notes.All.query db in
    expect (List.length notes) |> to_equal_int 1
  )
);
```

### Integration Tests

```ocaml
it "serves homepage" (fun () ->
  Well.with_test_server (fun port ->
    let url = Printf.sprintf "http://localhost:%d/" port in
    let resp = Well.fetch url in
    expect resp.body |> to_contain "Welcome"
  )
);
```

### Snapshot Testing

```ocaml
it "renders correctly" (fun () ->
  let html = element_to_string (render_page ()) in
  expect html |> to_match_snapshot
);
(* Snapshots stored in __snapshots__/*.snap alongside test file *)
(* Update: WELL_UPDATE_SNAPSHOTS=1 or well test -u *)
(* IMPORTANT: run ~source_file:__FILE__ () — needed for snapshot location *)
```

---

## RPC Context

For service-to-service calls with user context:

```ocaml
type rpc_ctx = {
  session_id: string; request_id: string;
  user_id: string option; user_name: string option; locale: string
}

Well.rpc_ctx : request -> rpc_ctx
Well.rpc_ctx_to_wire : rpc_ctx -> Yojson.Safe.t  (* JSON array format *)
Well.rpc_ctx_of_wire : Yojson.Safe.t -> rpc_ctx
```

---

## Telemetry (Well.Telemetry)

```ocaml
Well.Telemetry.snapshot_counters : unit -> counter_snapshot
(* { total_requests; errors_5xx; avg_latency_us; ws_messages; bus_events } *)

Well.Telemetry.requests_per_sec : unit -> float
Well.Telemetry.cpu_percent : unit -> float
Well.Telemetry.rss_kb : unit -> int
Well.Telemetry.system_snapshot : unit -> system_snapshot
```

---

## URL Encoding

```ocaml
Well.url_encode : string -> string  (* "hello world" → "hello%20world" *)
Well.url_decode : string -> string
```

---

## Deployment

Well apps are single-binary deployments. The scaffold generates a `.service` file for systemd.

**Simple deployment** (when target has matching libraries):
```bash
dune build
scp _build/default/bin/main.exe server:/srv/myapp/bin/myapp
scp -r static/ server:/srv/myapp/static/
scp -r data/ server:/srv/myapp/data/
scp myapp.service server:/etc/systemd/system/
ssh server "systemctl enable --now myapp"
```

**Self-contained deployment** (patchelf — bundles .so, works on any Linux x86_64):
```bash
make release    # creates _release/ with binary + lib/
scp -r _release/ server:/srv/myapp/
```

**Server directory structure:**
```
/srv/myapp/
  bin/myapp              # binary
  data/                  # SQLite databases (app.sqlite, well.sqlite)
  data/certs/            # auto-TLS certificates (managed by Well)
  static/                # CSS, JS, assets
```

**HTTPS**: Use `Well.run ~domain:"myapp.example.com" ~port:443 ()` — auto-provisions Let's Encrypt
certificate, stores in `data/certs/`, auto-renews. No nginx needed. Also listens on :80 for ACME + redirects.

---

## CLI Commands

```bash
well init <name>              # Scaffold new project
well test [-w] [-f pat] [-u]  # Run tests (watch, filter, update snapshots)
well docs [--open] [-o dir]   # Generate HTML documentation from (** *) comments
well contract build [dir]     # Generate code from TOML contracts
well db diff                  # Show pending schema migrations
well db rollback [path]       # Restore from .bak backup
well repl [-s socket] [-e expr]  # Interactive service query shell
```

### REPL Syntax

```
Service.method param:value      # Call RPC
let x = Service.method ...      # Bind result
x.field                         # Field access
expr | map .field               # Pipeline: map, filter, count, first, sort
"hello {x.name}"                # String interpolation
```

---

## Client-Side TypeScript (well.ts)

Compiled by bun to `well.js`. Auto-initializes as `window.well`.

**Build**: `static/dune` has rules that run `bun build` with `(mode promote)` — output JS lands in source tree.
Just run `dune build` (or `make build`) to rebuild TS. Add new `.ts` files by adding a `(rule ...)` to `static/dune`:
```lisp
(rule
 (targets my-script.js)
 (deps (source_tree ts))       ; if importing from ts/ subdirectory
 (mode promote)
 (action (run bun build ts/my-script.ts --outdir . --minify)))
```

### LiveView (automatic)

Discovers `<live-view>` elements, manages WebSocket connection on `/live`.
Event delegation: `data-lv-click`, `data-lv-submit`, `data-lv-change`, etc.

### Channel API

```javascript
const ch = well.channel("room:general");
ch.on("message", (payload) => { /* handle */ });
ch.push("send", { text: "hello" });
ch.leave();
```

### JS Hooks

```javascript
Well.hooks.MyHook = {
  mounted() {
    // this.el — DOM element
    // this.pushEvent("event", payload) — send to server
    // this.handleEvent("event", (data) => { ... }) — receive from server
  },
  updated() { /* after DOM patch */ },
  destroyed() { /* cleanup */ }
};
```

### File Upload Hook (built-in)

```html
<input type="file" data-lv-hook="FileUpload" />
```
Automatically uploads via base64 chunks over WebSocket.

---

## Forms & File Upload

```ocaml
(* URL-encoded form data *)
let title = Well.form req "title" in
let all_params = Well.form_params req in

(* CSRF token in forms — REQUIRED for POST *)
<form action="/submit" method_="POST">
  (csrf_input (Well.csrf_token req))
  <input type_="text" name_="title" />
  <button type_="submit">(txt "Submit")</button>
</form>

(* Textarea — children must be node, not bare string *)
<textarea name_="body">(txt "")</textarea>
<textarea name_="body">(txt some_variable)</textarea>

(* File upload — multipart *)
Well.post "/upload" @@ fun req ->
match Well.file req "file" with
| None -> Well.redirect "/upload"
| Some f ->
    Well.write_file ("data/uploads/" ^ f.filename) f.data;
    Well.redirect "/upload"

(* Multiple files *)
let all = Well.files req "files" in  (* uploaded_file list *)
let everything = Well.all_files req in  (* (string * uploaded_file) list *)
```

---

## Route Introspection

```ocaml
Well.list_routes : unit -> (string * string * string) list
(* Returns [(method, path, kind)] where kind = "handler" | "liveview" | "websocket" | "cap" *)
```

---

## Cap Admin Panel

Built-in admin dashboard at `/_well/`. Default login: `cap` / `admin`.

Disable with `Well.run ~disable_cap:true ()`.

Features: system stats, request telemetry, log viewer with filtering, route list, WebSocket connections, user management.

---

## Companion Skills

When working on this project, use these companion skills for specialized decisions:

- **idesign-architecture**: Use for ALL architectural decisions — decomposing the system into services, deciding where code should live, reviewing layer violations, designing service contracts. Routes/LiveViews (client layer) must NEVER call access layer directly — always go through a manager.
- **frontend-design**: Use when building or improving UI — pages, components, layouts, styling. Produces distinctive, production-grade interfaces instead of generic HTML.

Services must hide internal functions using `open struct ... end`. Only the contract-defined interface should be public.

---

## Common Patterns Checklist

When adding a new feature, you typically need:

1. **Static page**: Create `lib/client/pages/feature_page.mlx` with `Well.get "/path" @@ fun req -> ...`
2. **With data**: Create model file with `[@@deriving table]` + `let%query` + `let db = lazy (Well.Db.open_db ())`
3. **LiveView**: Create `lib/client/live/feature_live.mlx` with `model`/`msg` types + `[@@deriving yojson]` + all VIEW fields. Register with `Well.live "/feature" (module Feature_live)` in `lib/app.ml`. Then create a GET page that embeds `<Well.LiveView name="feature" />`. Both steps are required — `Well.live` only registers the WS handler, not the page.
4. **Pub/Sub**: Define event types in `events.ml` with `[@@deriving yojson, topic]`, publish/subscribe in handlers or LiveViews
5. **Service**: Create TOML contract, run `well contract build`, implement `IMPL` module, register + expose in `lib/app.ml`
6. **Auth-protected**: Add `~middleware:[Well.require_auth ()]` or wrap handler with `Well.Auth.require_grant`
7. **Tests**: Add to `test/` with `Well.Db.with_test_db` for DB tests or `Well.with_test_server` for integration tests

