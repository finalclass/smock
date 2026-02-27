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
      (Well.LiveView.live_preconnect_script ())
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

  val init : request -> Yojson.Safe.t -> model * string list
    (* Returns (initial_model, subscriptions).
       Subscriptions are MessageBus channels to auto-subscribe.
       Dynamic — can depend on init props (e.g. keyed topics). *)
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

let init _req _props = ({ count = 0 }, [])
(* Returns (model, subscriptions). Empty list = no MessageBus subscriptions. *)

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
(* sends: ["Increment"] → decoded as: Increment *)

(* With payload — encode JSON array in attribute *)
<button data_lv_click=(Printf.sprintf {|["SetPage", "smock"]|} (Html.escape_html page))>
  (txt page)
</button>
(* sends: ["SetPage", "cennik.html"] → decoded as: SetPage "cennik.html" *)

(* Static payload — use raw JSON string *)
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

(* Subscriptions returned from init — can be dynamic based on props *)
let init _req _props =
  ({ entries = [] }, [Well.topic_name Events.counter_event])

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

### pushLive — Send Messages from External JS

```javascript
// Send a message to the first LiveView on the page
well.pushLive(["SetPage", "index.html"]);

// Send to a specific LiveView topic
well.pushLive(["UpdateFilter", "active"], "/live/dashboard");
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

let make_model query =
  let results = search query in
  { query; results; empty_msg = if results = [] then "No results" else "" }

let init _req _props = (make_model "", [])
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
(* In LiveView module — subscriptions returned from init *)
let init _req _props =
  (initial_model, [Well.topic_name Events.counter_event])
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
| Error msg -> Well.log ~level:"error" "Mail error: smock" msg
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
Well.log ~level:"error" "Failed: smock" msg;
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

### `well build` — Production build with bundled libraries

```bash
well build    # requires: patchelf (pacman -S patchelf / apt install patchelf)
```

1. Runs `dune build`
2. Auto-discovers all shared libraries via `ldd`
3. Copies binary + all `.so` to `_release/`
4. Runs `patchelf` — sets interpreter to `bin/lib/ld-linux-*.so` and rpath to `$ORIGIN/lib`
5. Copies `static/` if present, creates `data/` directory

Output:
```
_release/
  bin/myapp          # relocatable binary (patchelf'd)
  bin/lib/           # all bundled .so (libc, libsqlite3, libgmp, libz, ...)
  static/            # CSS, JS, assets
  data/              # runtime databases (created empty)
```

Run locally: `cd _release && ./bin/myapp`

### `well release` — Create deployable archive

```bash
well release    # runs well build, then creates .tar.gz
```

Creates `myapp.tar.gz` — a single archive ready to deploy:
```bash
scp myapp.tar.gz server:/srv/myapp/
ssh server "cd /srv/myapp && tar xzf myapp.tar.gz && ./bin/myapp"
```

### Server setup

**Directory structure on server:**
```
/srv/myapp/
  bin/myapp              # relocatable binary (patchelf'd)
  bin/lib/               # bundled .so
  data/                  # SQLite databases (app.sqlite, well.sqlite)
  data/certs/            # auto-TLS certificates (managed by Well)
  static/                # CSS, JS, assets
```

The generated `.service` file uses `WorkingDirectory=/srv/myapp` and `ReadWritePaths=/srv/myapp/data`.

**HTTPS**: Use `Well.run ~domain:"myapp.example.com" ~port:443 ()` — auto-provisions Let's Encrypt
certificate via HTTP-01 challenge, stores certs in `data/certs/`, auto-renews. No nginx/reverse proxy needed.
The server also listens on port 80 for ACME challenges and HTTP→HTTPS redirects.

---

## CLI Commands

```bash
well init <name>              # Scaffold new project
well build                    # Production build (dune + patchelf + bundle .so → _release/)
well release                  # Build + create .tar.gz archive for deployment
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
|well_skill}

let idesign_skill_md = {idesign|---
name: idesign-architecture
description: >
  IDesign Method for system architecture based on Juval Lowy's "Righting Software".
  Use when designing system architecture, decomposing systems into services,
  reviewing architecture for anti-patterns, discussing volatility-based decomposition,
  layered architecture, service contracts, or composable design.
  Triggers: system design, architecture review, decomposition, microservices,
  service boundaries, layered architecture, volatility analysis, service contracts,
  system structure, anti-patterns, functional decomposition critique.
---

# IDesign Architecture Method

You are a software architect applying the IDesign Method from Juval Lowy's "Righting Software." Every recommendation you make MUST comply with the closed layered architecture, volatility-based decomposition, and the rules below. If you are unsure whether a recommendation complies, check it against the Design "Don'ts" and Interaction Rules before presenting it.

**The Method = System Design + Project Design**

This skill covers **System Design** -- the architecture half.

## The Design Prime Directive

**Never design against the requirements.**

There should never be a direct mapping between the requirements and the design. Requirements tell you WHAT the system must do. Design tells you HOW to structure it to accommodate change.

## Core Directives

1. **Avoid functional decomposition.** Never decompose a system based on its required functionality.
2. **Decompose based on volatility.** Identify areas of potential change and encapsulate them.
3. **Provide a composable design.** Find the smallest set of building blocks that satisfies all use cases.
4. **Offer features as aspects of integration, not implementation.** There is no feature -- features emerge from how components interact.
5. **Design iteratively, build incrementally.** Iterate on the design; build in vertical slices.

## Agent Decision Rules

When making architectural recommendations, you MUST follow these classification rules. Every component you recommend must fit into exactly one of the IDesign categories.

### Component Classification Decision Tree

When the user needs shared logic between multiple Managers:
1. **Is it a business activity (algorithm, calculation, validation, transformation)?** → Recommend a shared **Engine**. Engines are designed to be reused across Managers. Name it with a gerund prefix: `CalculatingEngine`, `ValidatingEngine`, `SearchEngine`.
2. **Is it access to a resource (database, external system, file store)?** → Recommend a shared **ResourceAccess**. Both Managers and Engines can call ResourceAccess. Name it with a noun prefix: `MembersAccess`, `PaymentsAccess`.
3. **Is it cross-cutting infrastructure (logging, security, messaging, diagnostics)?** → Recommend a **Utility**. The litmus test: could this component plausibly be used in any other system?
4. **Is it use-case orchestration (workflow, sequence of steps)?** → It belongs in a **Manager**. If two Managers need the same orchestration, reconsider your decomposition -- you may have too many Managers.

### NEVER Recommend These

- **NEVER** recommend shared libraries, shared modules, helper packages, or common code projects for business logic. In IDesign, ALL business logic lives in services (Managers, Engines, ResourceAccess). Shared business logic = shared Engine.
- **NEVER** recommend direct service-to-service calls that violate the closed architecture (calling up, calling sideways, skipping layers).
- **NEVER** recommend an open or semi-open architecture pattern.
- **NEVER** recommend services named after business domains or entities (OrderService, CustomerService, ProductService) -- this is domain/functional decomposition.
- **NEVER** recommend CRUD-based ResourceAccess contracts (Insert, Select, Delete). Use atomic business verbs (Credit, Debit, Enroll, Pay).
- **NEVER** recommend generic patterns (repository pattern, unit of work, mediator) as substitutes for proper IDesign classification. If you are tempted to suggest a pattern, first classify the component into an IDesign layer.

### Before Presenting Any Recommendation

Run this checklist:
1. **Layer check**: Does every component belong to exactly one layer (Client, Manager, Engine, ResourceAccess, Resource, Utility)?
2. **Naming check**: Managers have noun prefixes, Engines have gerund prefixes, ResourceAccess has noun prefixes. No gerunds outside Engines.
3. **Closed architecture check**: Does every call go to the adjacent lower layer only? Are there any up-calls, sideways calls, or skip-layer calls?
4. **Cardinality check**: Are there more than 5 Managers? Is the Manager-to-Engine ratio reasonable?
5. **Functional decomposition check**: Do any service names mirror requirements or business domains? If yes, reconsider.
6. **Reuse check**: If two Managers use different components for the same activity, you have functional decomposition. They should share one Engine.
7. **Symmetry check**: Do call chains across use cases follow similar patterns? Asymmetry is a design smell.

## What Is Wrong with Functional Decomposition

Functional decomposition (creating services that mirror requirements: InvoicingService, BillingService, ShippingService) is the most common and most damaging approach. It:

- **Couples services to requirements** -- any requirement change forces architecture change
- **Precludes reuse** -- services encode call ordering and cannot be used independently
- **Bloats clients** -- clients must orchestrate services, absorbing business logic
- **Creates either god services or service explosions** -- too few massive or too many tiny services
- **Maximizes the effect of change** -- changes ripple across multiple services
- **Makes systems untestable** -- regression testing becomes impractical

**Domain decomposition** (services per business domain: Sales, Accounting, Shipping) is functional decomposition in disguise with the same problems plus cross-domain duplication.

**The anti-design exercise:** Split the team. Ask one half for the best design, the other for the worst. They produce the same design -- because functional decomposition is both the natural approach AND the worst approach.

See [references/decomposition.md](references/decomposition.md) for full details.

## Volatility-Based Decomposition

The Method's core design directive: **decompose based on volatility.**

- Identify **areas of potential change** and encapsulate them into services
- Implement required behavior as the **interaction between encapsulated areas of volatility**
- Any change is contained within its vault -- no shrapnel flying everywhere
- What you encapsulate CAN be functional in nature but is hardly ever domain-functional

### Identifying Volatility

- Volatility is NOT variability. A tradesman gaining new attributes is variable. The membership management process changing is volatile.
- If identifying a volatility produces domain decomposition along entity lines, look further.
- You must clearly state: WHAT the volatility is, WHY it is volatile, WHAT RISK it poses.
- Volatility may reside outside the system (e.g., payments as external Resources).
- Solutions masquerading as requirements must be eliminated before identifying volatilities.

### Common Axes of Volatility

When examining a system, look for volatility in these areas:

| Axis | Examples |
|------|----------|
| **Client applications** | Different UIs, devices, APIs, connectivity models |
| **Business workflows** | Sequence of activities in use cases changing over time |
| **Business rules/activities** | How specific activities are performed (algorithms, regulations) |
| **Resource access** | Storage technology, location, access method |
| **Regulations/compliance** | Rules changing per locale, over time |
| **Integration** | External systems, protocols, data formats |
| **Security** | Authentication models, authorization schemes |
| **Deployment** | Cloud vs on-premise, data locality |

See [references/decomposition.md](references/decomposition.md) for full details.

## Layered Architecture (The Four Layers + Utilities)

The Method prescribes a **closed architecture** with four layers plus a Utilities bar.

```
  ┌─────────────────────────────────────────────┐
  │              CLIENT LAYER                    │  ← Who
  │  (Portals, Apps, APIs, Timers, Admin)       │
  ├─────────────────────────────────────────────┤
  │         BUSINESS LOGIC LAYER                │
  │  ┌──────────────┐  ┌──────────────┐         │
  │  │   Managers    │  │   Engines    │         │  ← What / How
  │  │ (sequence)    │  │ (activity)   │         │
  │  └──────────────┘  └──────────────┘         │
  ├─────────────────────────────────────────────┤  ┌──────────┐
  │         RESOURCE ACCESS LAYER               │  │          │
  │  (Atomic business verbs, NOT CRUDs)         │  │ UTILITIES│
  ├─────────────────────────────────────────────┤  │  BAR     │
  │            RESOURCE LAYER                   │  │(Security,│
  │  (Database, Files, Queues, External Systems)│  │ Logging, │
  └─────────────────────────────────────────────┘  │ Pub/Sub) │
                                                   └──────────┘
```

### Layer Roles

| Layer | Encapsulates | Component Type | Named As |
|-------|-------------|----------------|----------|
| **Client** | Volatility in WHO interacts | Client apps | N/A |
| **Manager** | Volatility in WHAT (use case sequence) | Managers | NounManager |
| **Engine** | Volatility in HOW (business activity) | Engines | GerundEngine |
| **ResourceAccess** | Volatility in HOW to access resources | ResourceAccess | NounAccess |
| **Resource** | WHERE system state lives | Resources | N/A |
| **Utilities** | Cross-cutting infrastructure | Utilities | Security, Logging, etc. |

### Key Properties

- **Volatility decreases top-down**: Clients are most volatile; Resources are least volatile
- **Reuse increases top-down**: Clients are least reusable; Resources are most reusable
- **Managers should be almost expendable**: If changing a Manager is expensive, it is too big. If trivial, it is pass-through (a flaw).
- **Closed architecture**: Components call only the adjacent lower layer. No up, no sideways, no skip-layer.
- **ResourceAccess exposes atomic business verbs** (Credit, Debit, Pay), NOT CRUDs (Select, Insert, Delete)

### Naming Rules

- Two-part compound words in PascalCase: prefix + type suffix
- **Managers**: noun prefix (AccountManager, MarketManager)
- **Engines**: gerund prefix (CalculatingEngine, SearchEngine, RegulationEngine)
- **ResourceAccess**: noun prefix associated with the Resource (MembersAccess, PaymentsAccess)
- Gerund prefixes ONLY on Engines. Gerunds elsewhere signal functional decomposition.

### Cardinality Guidelines

- **Max 5 Managers** in a system without subsystems
- **Max a handful of subsystems**
- **Max 3 Managers per subsystem**
- Golden ratio: 1 Manager: 0-1 Engines, 2 Managers: ~1 Engine, 3 Managers: ~2 Engines, 5 Managers: ~3 Engines
- **8+ Managers**: you have failed to produce a good design

See [references/structure.md](references/structure.md) for full details.

## Design "Don'ts"

These are **red flags indicating functional decomposition**. Violations must be investigated.

See [references/design-donts.md](references/design-donts.md) for the complete list (verbatim from the book).

## Composable Design

### Core Use Cases

Every system has 2-6 **core use cases** representing its raison d'etre. The composable design finds the **smallest set of ~10 components** that satisfies ALL core use cases. Non-core use cases (add member, create project, pay) are simple functionalities that any design can handle.

### "There Is No Feature"

Features are aspects of **integration**, not implementation. You do not implement features in individual services. Features emerge from how services interact. To add or change a feature, you change the workflows of the Managers, not the participating services.

### Handling Change

When a new requirement arrives, the correct response with a composable design is:
1. Mostly leave existing things alone
2. Extend the system by adding more slices or subsystems
3. Never destroy the first floor to add a second floor

See [references/composition.md](references/composition.md) for full details.

## Service Contract Design

Contracts are the public interfaces services present to clients. The basic element of reuse is the **contract, not the service**.

### Good Contracts Are:
1. **Logically consistent** -- no unrelated operations
2. **Cohesive** -- all aspects of the interaction, no more, no less
3. **Independent** -- each facet stands alone

### Contract Size Metrics
- **Optimal**: 3-5 operations per contract
- **Acceptable**: 6-9 operations
- **Poor design**: 12+ operations
- **Immediate reject**: 20+ operations
- **Red flag**: single-operation contracts

### Other Rules
- Avoid property-like operations (getters/setters)
- Limit contracts per service to 1 or 2
- Factor contracts down (base extraction), sideways (separate unrelated), up (shared hierarchy)

### Area of Minimum Cost
Total system cost = cost per service + integration cost. Both are nonlinear. There exists an **area of minimum cost** where services are not too big, not too small. Functional decomposition always lands at the expensive edges.

See [references/contract-design.md](references/contract-design.md) for full details.

## Design Validation

Validate the architecture BEFORE work begins:

1. Show the **call chain** or **sequence diagram** for each core use case
2. Demonstrate that the same components participate in multiple use cases in consistent patterns
3. Look for **self-similarity and symmetry** across call chains -- hallmark of good design
4. If validation is ambiguous, go back to the drawing board

## Business Alignment

Architecture must serve the business:

1. **Vision** -- terse, explicit, like a legal statement (e.g., "A platform for building applications to support the marketplace")
2. **Objectives** -- business perspective items derived from the vision (NOT technology objectives)
3. **Mission Statement** -- HOW you will deliver (e.g., "Design and build a collection of software components that the team can assemble into applications and features")
4. **Architecture** -- derived from mission statement, supporting all objectives

This chain (Vision -> Objectives -> Mission -> Architecture) reverses typical dynamics and gets the business on your side.

## Interaction Rules (Closed Architecture)

**Allowed:**
- All components can call Utilities
- Managers and Engines can call ResourceAccess
- Managers can call Engines
- Managers can queue calls to another Manager

**Forbidden** (see [Design "Don'ts"](references/design-donts.md)):
- No calling up
- No calling sideways (except queued Manager-to-Manager)
- No calling more than one layer down
- Resolve violations with queued calls or Pub/Sub

## Quick Reference Files

- [Decomposition](references/decomposition.md) -- Volatility-based decomposition, why functional/domain decomposition fail
- [Structure](references/structure.md) -- Layers, classification, naming, open/closed architectures, symmetry
- [Composition](references/composition.md) -- Composable design, core use cases, handling change
- [Design "Don'ts"](references/design-donts.md) -- VERBATIM list of architectural violations
- [Design Standard](references/design-standard.md) -- VERBATIM checklist of all directives and guidelines
- [Contract Design](references/contract-design.md) -- Service contracts, factoring, metrics, area of minimum cost
- [Design Example](references/design-example.md) -- TradeMe case study demonstrating the full method
|idesign}

let idesign_ref_decomposition = {idesign|# Decomposition (Ch. 2)

## Core Premise: Architecture = Decomposition

- **Software architecture** is the high-level design and structure of the software system.
- The essence of architecture is the breakdown of the system into its comprising components and how those components interact at run-time. This act is called **system decomposition**.
- **Wrong decomposition = wrong architecture**, which inflicts horrendous pain in the future, often leading to a complete rewrite.
- Services (in the service-orientation sense) are the most granular unit of architecture. Technology details (interfaces, operations, class hierarchies) are detailed design, NOT system decomposition.

## Avoid Functional Decomposition

Functional decomposition decomposes a system into building blocks based on its functionality. If the system needs invoicing, billing, and shipping, you create InvoicingService, BillingService, ShippingService.

### Why It Fails

1. **Couples services to requirements** -- any change in required functionality imposes a change on services. Such changes are inevitable over time.
2. **Precludes reuse** -- services encode call ordering (what comes before/after), forming a clique of tightly coupled services that cannot be independently reused.
3. **Too many or too big** -- leads to an explosion of services (hundreds of narrow functionalities) or bloated god monoliths. Both afflictions often appear side by side.
4. **Client bloat and coupling** -- someone must combine functional services into required behavior; that someone is the client. The client absorbs business logic (sequencing, ordering, error compensation). The client IS the system. Multiple clients (web, mobile) duplicate orchestration logic.
5. **Multiple points of entry** -- the client enters the system in multiple places, multiplying security, scalability, and cross-cutting concerns.
6. **Service chaining bloat** -- alternative: services call each other (A calls B calls C). Services become coupled to call order. Error compensation creates massive coupling (C must undo A and B on failure).
7. **Maximizes the effect of change** -- by definition, changes affect multiple (if not most) components. Accommodating change is THE reason to avoid functional decomposition.
8. **Makes systems untestable** -- coupling and complexity make only unit testing practical. Unit testing alone is borderline useless (defects are in interactions). Functional decomposition makes regression testing impractical, producing systems rife with defects.

### The TANSTAAFL Argument

Functional decomposition violates the first law of thermodynamics: the outcome (system design) should be high-value, but the process (mapping requirements to services) is fast, easy, mechanistic. **You cannot add value without effort.** The very attributes that make functional decomposition appealing preclude it from adding value.

### When TO Use Functional Decomposition

Functional decomposition IS a decent **requirements discovery technique** -- it helps discover hidden functionality areas, uncover requirements and their relationships. **Extending functional decomposition into a design is deadly.** There should never be a direct mapping between requirements and design.

## Avoid Domain Decomposition

Domain decomposition decomposes based on business domains (Sales, Engineering, Accounting). It is **even worse** than functional decomposition -- it is functional decomposition in disguise (Kitchen is where you do the cooking, Bedroom is where you do the sleeping).

Problems unique to domain decomposition:
- Each domain must duplicate functionality that occurs across domains
- Each domain devolves into an ugly grab bag of functionality
- Cross-domain communication reduced to CRUD-like state changes
- Building sequentially by domain is catastrophically wasteful (each new domain requires reworking all previous domains)
- There is no meaningful reuse between parts

## Volatility-Based Decomposition

### The Method's Design Directive

**Decompose based on volatility.**

### Definition

Volatility-based decomposition identifies **areas of potential change** and encapsulates those into services or system building blocks. You then implement the required behavior as the **interaction between the encapsulated areas of volatility**.

### The Vault Metaphor

Think of your system as a series of vaults. Any change is like a hand grenade with the pin pulled out. With volatility-based decomposition: open the appropriate vault's door, toss the grenade inside, close the door. Whatever was inside may be destroyed completely, but **there is no shrapnel flying everywhere**. You have contained the change.

### Encapsulation Is Not Necessarily Functional

What you encapsulate CAN be functional in nature but is hardly ever domain-functional (meaningful to the business). Example: Electricity in a house is an area of functionality AND an important area to encapsulate because power is highly volatile (AC/DC, 110V/220V, solar/generator/grid) and not specific to any domain. The receptacle encapsulates all that volatility.

### Identifying Volatility

- **Volatility vs. Variability**: A tradesman gaining new attributes is variable (data changes). The membership management process changing is volatile (behavior/structure changes). Only volatile things merit components.
- If identifying a volatility produces domain decomposition along entity lines, look further for the true underlying volatility.
- You must clearly state: WHAT the volatility is, WHY it is volatile, WHAT RISK it poses (likelihood and effect).
- There is nothing wrong with suggesting candidate volatilities, then examining the resultant architecture. If the result is a spiderweb of interactions or is asymmetric, the design is likely wrong.
- Volatility may reside outside the system entirely (e.g., payments handled by external systems as Resources).

### Solutions Masquerading as Requirements

Requirements often contain embedded solutions that constrain the design space unnecessarily. Before identifying volatilities, eliminate solutions masquerading as requirements:
- "The system shall use a SQL database" -- the real requirement is data persistence
- "The system shall send email notifications" -- the real requirement is user notification
- Strip away the "how" to reveal the "what"

### Benefits

- Changes are **contained in each module** -- no side effects outside the module boundary
- Lower complexity + easier maintenance = much improved quality
- **Reuse**: if something is encapsulated the same way in another system, you have a chance at reuse
- **Extensibility**: extend by adding more areas of encapsulated volatility or integrating existing areas differently
- **Resilience to feature creep**: changes during development are contained, giving a better chance of meeting the schedule

### VBD and Testing

Volatility-based decomposition lends well to regression testing. Fewer components, smaller components, and simpler interactions drastically reduce complexity. This makes it feasible to write regression testing that tests the system end to end, tests each subsystem individually, and eventually tests independent components. Since VBD contains changes inside building blocks, inevitable changes do not disrupt regression testing. You can test a change in isolation without interfering with inter-component and inter-subsystem testing.

### The Volatility Challenge

The main challenges in performing volatility-based decomposition have to do with **time, communication, and perception**:

- Volatility is often not self-evident. No customer will present requirements as areas of volatility -- they present functionality.
- VBD takes longer than functional decomposition. You must analyze requirements to recognize areas of volatility.
- The whole purpose of requirements analysis is to identify areas of volatility. This requires effort and sweat -- complying with the first law of thermodynamics (TANSTAAFL).
- **The 2% problem**: Architects decompose complete systems only every few years. The week-to-year ratio is roughly 1:50, or 2%. You will never be good at something you spend only 2% of your time on. Managers who spend an even smaller fraction managing architects during this critical phase will not understand why it takes time.
- **Dunning-Kruger effect**: People unskilled in a domain underestimate its complexity. When a manager says "just do A, then B, then C" they genuinely do not understand why proper decomposition takes time. Expect this and educate.
- **Fighting insanity**: If functional decomposition is all you have ever done, you will hear an irresistible pull to repeat it. You must resist. Your professional integrity is at stake.

### Resist the Siren Song

Just because you always had a reporting block, or because a reporting block already exists, does not mean you need a dedicated reporting component. If reporting is not a volatile area (from the business perspective), there is nothing to encapsulate. Adding such a component manifests functional decomposition.

You are Odysseus. Volatility-based decomposition is your mast. Resist the siren song of your previous bad habits. Plug the ears of the developers (they row/write code) and tie yourself to the method even when temptation strikes.

### Volatility and the Business

Not everything that could change should be encapsulated. Do **not** attempt to encapsulate the **nature of the business**.

Two indicators that a potential change is the nature of the business (and should NOT be encapsulated):
1. **The change is very rare** -- the likelihood of it happening is very low
2. **The encapsulation can only be done poorly** -- no practical amount of investment in time or effort will properly encapsulate it

A change to the nature of the business justifies killing the old system and starting from scratch (like razing a house to build a skyscraper on the same plot).

**Speculative design**: Once you embrace VBD, you may start seeing volatilities everywhere and try to encapsulate everything. This produces numerous building blocks -- a clear sign of bad design. If the use of an encapsulation is extremely unlikely, or it attempts to change the nature of the system, you have fallen into the speculative design trap.

### Design for Your Competitors

A useful technique for identifying volatilities: try to design a system for your competitor (or another division).

- Ask: Can your competitor use the system you are building? Can you use theirs?
- If not, list the barriers to reuse. Where both companies perform the same service differently, that activity is probably volatile -- encapsulate it.
- If both do something identically with no chance of divergence, there is no need for a component. Allocating one would be functional decomposition. Things competitors do identically likely represent the nature of the business.
- If you encapsulate a volatile activity and your competitor later adopts the same approach, the change is contained in a single component -- you have future-proofed your system.

### Volatility and Longevity

Volatility is intimately related to longevity. The longer things have been done a certain way, the longer they will likely continue -- but also the longer until they eventually change.

- You must put forward a design that accommodates changes even if at first glance they seem independent of current requirements.
- **Heuristic for time horizon**: If the projected system lifespan is 5-7 years, identify everything that changed in the application domain over the past 7 years. Similar changes will likely occur within a similar timespan.
- Examine the longevity of all involved systems and subsystems your design interacts with. If the ERP changes every 10 years and the last change was 8 years ago, encapsulate the ERP volatility.
- The more frequently things change, the more likely they will change again at the same rate.

### The Importance of Practicing

Identifying areas of volatility is an **acquired skill**. Hardly any architect is initially trained in VBD, and the vast majority use functional decomposition. The best way to master VBD is to practice:

- Practice on everyday software systems you are familiar with (insurance company, mobile app, bank, online store)
- Examine your own past projects -- what were the pain points? Was it functional decomposition? What would the volatility-based design look like?
- Practice on physical systems (house, car, airplane) -- the principles are universal
- Study existing well-designed systems and identify their encapsulated volatilities

## Red Flags / Anti-Patterns

1. Services named after business operations (InvoicingService, BillingService, BuyingStocks)
2. Client orchestrating multiple functional services
3. Services that know about call ordering (what comes before/after them)
4. Services chaining to each other with error compensation callbacks
5. Multiple points of entry to the system
6. Changes to one requirement requiring changes across multiple services
7. God services that are grab bags of related functionality
8. Explosion of tiny services each handling a narrow functional variation
9. Direct 1:1 mapping from requirements list to service list
10. Business logic residing in the client
11. Difficulty switching clients (web to mobile) due to embedded logic
12. Cross-cutting concern changes (notifications, storage) requiring changes to all services
|idesign}

let idesign_ref_structure = {idesign|# Structure (Ch. 3)

## Layers and Services

A layered approach to system design requires a handful of layers, terminating with a layer of actual physical resources (database, message queue, etc.). The preferred way of crossing layers is by calling services.

### Benefits of Using Services

1. **Scalability** -- services can be instantiated per-call, avoiding proportional back-end load
2. **Security** -- service-oriented platforms treat security as first-class; they authenticate and authorize all calls (not just from client, but between services)
3. **Throughput and availability** -- services can accept calls over queues, handling excess load; multiple instances can process the same queue
4. **Responsiveness** -- services can throttle calls into a buffer
5. **Reliability** -- can use reliable messaging protocols, handle network issues, order calls
6. **Consistency** -- services can participate in the same unit of work (transaction or coordinated business transaction with eventual consistency)
7. **Synchronization** -- calls can be automatically synchronized even if clients use multiple concurrent threads

## The Four Layers + Utilities

### Client Layer (Presentation Layer)

- The top layer. Elements can be end-user applications OR other systems interacting with your system.
- All Clients use the same entry points, subject to the same access security, data types, and interfacing requirements.
- Encapsulates the potential volatility in Clients: desktop apps, web portals, mobile apps, APIs, admin applications. These use different technologies, deploy differently, have their own versions and life cycles.
- Often the most volatile part of a typical software system.
- Changes in one Client component do not affect another.

### Business Logic Layer

Encapsulates the volatility in the system's business logic (required behavior, best expressed in use cases).

#### Managers
- Encapsulate the volatility in the **sequence** (orchestration of the workflow)
- Tend to encapsulate a **family of logically related use cases** within a particular subsystem
- Each Manager has its own related set of use cases to execute

#### Engines
- Encapsulate the volatility in the **activity** (business rules and activities)
- More restricted scope than Managers
- Managers may use zero or more Engines
- Engines may be shared between Managers (designed with reuse in mind)
- If two Managers use two different Engines for the same activity, you have functional decomposition

### Resource Access Layer

- Encapsulates the volatility in accessing a resource
- Must encapsulate both: (a) volatility in the method of access, and (b) volatility in the resource itself

**Critical Rule: Do NOT expose CRUD-like or I/O-like contracts.**
- If your ResourceAccess contract has Select(), Insert(), Delete() -- you are exposing that the resource is a database
- Avoid operations like Open(), Close(), Seek(), Read(), Write() -- these betray a file-based resource

**Use Atomic Business Verbs:**
- Activities decompose to indivisible activities called atomic business verbs
- Example: In a bank, "credit" and "debit" are atomic business verbs (atomic from the business perspective)
- Atomic business verbs are practically immutable because they relate to the nature of the business
- A well-designed ResourceAccess exposes atomic business verbs, converting them internally to CRUDs

### Resource Layer

- Contains actual physical Resources: database, file system, cache, message queue
- The Resource can be internal or external to the system
- Often the Resource is a whole system in its own right

### Utilities Bar

- A vertical bar on the side of the architecture containing Utility services
- Common infrastructure that nearly all systems require
- Examples: Security, Logging, Diagnostics, Instrumentation, Pub/Sub, Message Bus, Hosting
- **Litmus test**: Can the component plausibly be used in any other system, such as a smart cappuccino machine?

## Classification Guidelines

### Naming Rules

Names must be two-part compound words in PascalCase. The suffix is the service type.

| Type | Suffix | Prefix | Examples |
|------|--------|--------|----------|
| Manager | Manager | Noun associated with encapsulated use case volatility | AccountManager, MarketManager, MembershipManager |
| Engine | Engine | Gerund (noun from verb + "-ing") or noun describing activity | CalculatingEngine, SearchEngine, RegulationEngine |
| ResourceAccess | Access | Noun associated with the Resource | MembersAccess, PaymentsAccess, ProjectsAccess |

**Gerund rules:**
- Gerunds should ONLY be used as prefix with Engines. Gerunds elsewhere signal functional decomposition.
- Good: CalculatingEngine (Engines "do" things: aggregate, adapt, strategize, validate, rate, calculate, transform)
- Bad: BillingManager, BillingAccess -- the gerund conveys "doing" rather than orchestration or access volatility
- Good: AccountManager, AccountAccess

**Atomic business verbs should NOT be used in a prefix** for a service name. These verbs belong only in operation names in contracts at the resource access level.

### The Four Questions

| Question | Layer | Description |
|----------|-------|-------------|
| **Who** | Clients | Who interacts with the system |
| **What** | Managers | What is required of the system |
| **How** (Business) | Engines | How the system performs business activities |
| **How** (Resource) | ResourceAccess | How the system accesses Resources |
| **Where** | Resources | Where the system state is |

Use the four questions for **initiation** (start with a clean slate) and **validation** (check: are all Clients purely "who" with no "what"?).

### Managers-to-Engines Ratio

| Managers | Engines |
|----------|---------|
| 1 | 0 or at most 1 |
| 2 | likely 1 |
| 3 | 2 is likely best |
| 5 | may need as many as 3 |
| 8+ | you have already failed |

Most systems will never have many Managers because they will not have many truly independent families of use cases. A single Manager can support more than one family of use cases (different service contracts or facets).

### Key Observations

**Volatility decreases top-down:**
- Clients are the most volatile
- Managers change when use cases change, but less than Clients
- Engines are less volatile than Managers
- ResourceAccess is even less volatile
- Resources are the least volatile, changing at a glacial pace

This is extremely valuable: the most-depended-upon components (lower layers) are also the least volatile. If they were most volatile, the system would implode.

**Reuse increases top-down:**
- Clients are hardly ever reusable (platform-specific)
- Managers are reusable (same Manager from multiple Clients)
- Engines are even more reusable (same Engine called by multiple Managers)
- ResourceAccess components are very reusable
- Resources are the most reusable element

**Almost-Expendable Managers:**
1. **Expensive Manager** -- you fight the change, fear its cost. Too big, likely functional decomposition.
2. **Expendable Manager** -- you shrug it off, think nothing of it. Pass-through. Always a design flaw.
3. **Almost-Expendable Manager** -- you contemplate the change, think through specific ways to adapt. **This is the ideal.** The Manager merely orchestrates Engines and ResourceAccess, encapsulating sequence volatility.

## Subsystems and Services

### Vertical Slices
- A cohesive interaction between Manager, Engine, and ResourceAccess constitutes a logical subsystem -- a vertical slice
- Each vertical slice implements a corresponding set of use cases

### Sizing
- Avoid over-partitioning. Most systems: only a handful of subsystems.
- Limit Managers per subsystem to three.

### Incremental Construction
- **Incremental** = build components layer by layer within a correct architecture (foundation, walls, roof)
- **Iterative** = grow from a small version to a larger one (skateboard to car) -- wasteful and difficult
- Building incrementally is predicated on the architecture remaining constant. Only possible with volatility-based decomposition.
- Extensibility: mostly leave existing things alone, extend by adding more slices or subsystems.

## About Microservices

There are no microservices -- only services. Services are services regardless of size.

### Three Problems with Microservices (as commonly practiced)

1. **Implied constraint on the number of services** -- the building blocks within subsystems (Manager, Engine, ResourceAccess) should all be services too. Push the benefits of services as deep as possible.
2. **Widespread use of functional decomposition** -- dooms every microservices effort. Potentially the biggest failure in the history of software.
3. **Communication protocols** -- the vast majority use REST/HTTP for all communication. A well-designed system should NEVER use the same communication mechanism internally and externally. External: HTTP may be fine. Internal: use fast, reliable channels (TCP/IP, named pipes, IPC, message queues, etc.).

## Open and Closed Architectures

### Open Architecture (Avoid)
- Any component can call any other regardless of layer
- Trading encapsulation for flexibility is a bad trade
- Calling down multiple layers: when you switch a Resource, all Engines must change
- Calling up: Manager must respond to UI changes
- Calling sideways: Manager A calling Manager B -- almost always functional decomposition

### Closed Architecture (Preferred)
- Components in one layer can call those in the adjacent lower layer only
- Promotes decoupling by trading flexibility for encapsulation -- the better trade

### Semi-Closed/Semi-Open (Avoid)
- Allows calling more than one layer down
- Justified only in: (1) key infrastructure where every ounce of performance matters, (2) codebases that hardly ever change

## Relaxing the Rules

### Calling Utilities
Utilities reside in a vertical bar cutting across all layers. Any component can use any Utility.

### Calling ResourceAccess by Business Logic
Both Managers and Engines can call ResourceAccess without violating closed architecture.

### Managers Calling Engines
Managers can directly call Engines. Engines are really an expression of the Strategy design pattern.

### Queued Manager-to-Manager Calls
A Manager can queue a call to another Manager (the queue listener is effectively another Client). Business systems commonly have one use case triggering a deferred execution of another use case.

### Opening the Architecture (Handling Violations)
- Do NOT brush transgressions aside or demand blind compliance
- Nearly always, a transgression indicates an underlying need
- Address the need in a way that complies with closed architecture
- Sideways Manager call? -> Queue the call instead
- Manager calls up to Client? -> Use Pub/Sub Utility service

## Strive for Symmetry

- All good architectures are symmetric
- Symmetry appears as repeated call patterns across use cases
- Absence of symmetry is a cause for concern
- If a Manager implements four use cases and three publish events but the fourth does not -- why? Investigate.
- If only one of four use cases queues a call to another Manager -- that asymmetry is a design smell
- Symmetry is so fundamental you should see the same call patterns across Managers
|idesign}

let idesign_ref_composition = {idesign|# Composition (Ch. 4)

## Requirements and Changes

Requirements change -- that is what requirements do. The more requirements change, the higher the demand for software professionals. Embrace change; it is what keeps you employed.

### Resenting Change

Most developers design their system against the requirements, maximizing the affinity between requirements and architecture. When requirements change, the design must change too. This makes change painful, expensive, and destructive. People learn to resent change -- literally resenting the hand that feeds them.

### The Design Prime Directive

**Never design against the requirements.**

Any attempt at designing against the requirements will always guarantee pain. There should never be a direct mapping between requirements and design.

### Futility of Requirements

- A decent system has dozens of use cases; large systems have hundreds
- No one has ever had the time to correctly spec all use cases upfront
- Requirements specs contain duplicates, contradictions, missing items
- Requirements will change over time: new ones added, existing ones removed or modified
- Attempting to gather the complete set and design against them is an exercise in futility

## Composable Design

The goal of any system design is to satisfy ALL use cases -- present and future, known and unknown. A composable design does not aim to satisfy any use case in particular.

### Core Use Cases

Not all use cases are equal. There are only two types:
- **Core use cases**: represent the essence of the business (2-6 per system, rarely more)
- **Regular use cases**: variations and permutations of core use cases

Core use cases:
- Will hardly ever be presented explicitly in the requirements document
- Are not easy to find, and the small number does not make it simple to agree on what they are
- Will almost always be some kind of abstraction of other use cases
- May require a new term or name to differentiate them from the rest
- Even a flawed requirements document will contain them because they ARE the essence of the business

Finding core use cases is an iterative process between the architect and the requirements owner.

### The Architect's Mission

Your mission as architect: identify the **smallest set of components** that you can put together to satisfy all the core use cases. Since all other use cases are merely variations, regular use cases represent a different interaction between the components, not a different decomposition.

**When requirements change, your design does not.**

This is about decomposition into components, not implementation. The integration code inside Managers will change as requirements change -- but that is an implementation change, not an architectural change.

## Architecture Validation

Composable design enables **design validation**: produce an interaction between your services for each core use case.

### Call Chain Diagrams
- Superimpose the call chain onto the layered architecture diagram
- Components connected by arrows showing direction and type of call
- Solid black arrow = synchronous (request/response) call
- Dashed gray arrow = queued call
- Simple, quick, good for nontechnical audiences
- Downside: no notion of call order, duration, or multiple calls to same component

### Sequence Diagrams
- Similar to UML sequence diagrams with IDesign notational differences
- Lifelines colored according to architectural layers
- Each participating component has a vertical bar (lifeline)
- Time flows top to bottom; length of bars indicates relative duration
- Better for complex use cases and technical audiences
- Extremely useful for subsequent detailed design (interfaces, methods, parameters)

### Smallest Set

You want not just a set of components but the **smallest** set. Less is more in architecture.

- A monolith (1 component) is too few -- horrible internal complexity
- 300 components (one per use case) is too many -- high integration cost
- The order of magnitude for a typical system is ~10 services
- Using The Method: 2-5 Managers, 2-3 Engines, 3-8 ResourceAccess, plus Resources and Utilities = ~12 building blocks at most
- If larger, break into subsystems

**You cannot validate architectures with a single component or hundreds of components.** A single large component by definition does everything, and a component per use case also supports all use cases -- neither proves design merit.

### Duration of Design Effort

- Requirements gathering and analysis may take weeks or months -- that is NOT design
- Once you have the core use cases and areas of volatility, producing a valid design using The Method takes hours to a few days at most
- Design is not time-consuming if you know what you are doing

## There Is No Feature

**Features are always and everywhere aspects of integration, not implementation.**

This is a universal design rule governing all systems. You never see a "feature" as a discrete component in any well-designed system:
- A car transports you from A to B -- the feature emerges from integrating chassis, engine, gearbox, seats, dashboard, driver, road, insurance, and fuel
- A laptop provides word processing -- the feature emerges from integrating keyboard, screen, hard drive, bus, CPU, and memory
- This is fractal: every level of every system works the same way, down to the quarks

In software: you do not implement features in individual services. Features emerge from how services interact. To add or change a feature, you change the workflows of the Managers, not the participating services.

## Handling Change

With functional decomposition, change is spread across multiple components and aspects of the system. People defer changes, fight changes, or explain to customers that changes are bad ideas. Fighting change is tantamount to killing the system -- customers need the feature now, not in six months.

### Containing the Change

The trick is not to fight, postpone, or punt change -- it is to **contain its effects**.

With volatility-based decomposition:
- A change to a requirement is a change to a use case
- Some Manager implements the workflow executing that use case
- The Manager may be gravely affected -- perhaps you discard it entirely and create a new one
- But the underlying components (Engines, ResourceAccess, Resources, Utilities) are NOT affected

The bulk of effort in any system goes into the services the Manager uses:
- **Engines** are expensive: business activities vital to the system's workflows
- **ResourceAccess** is nontrivial: identifying atomic business verbs, translating them to resource access methods
- **Resources** must be scalable, reliable, highly performant: schemas, caching, replication, partitioning, connection management, indexing, transactions, etc.
- **Utilities** require top skills: world-class security, diagnostics, logging, messaging, hosting
- **Clients** are time and labor intensive: superior UX, convenient and reusable APIs

When a change happens to the Manager, you salvage and reuse ALL the effort that went into Clients, Engines, ResourceAccess, Resources, and Utilities. By reintegrating these services in the Manager, you contain the change and respond quickly and efficiently.

**This is the essence of agility.**
|idesign}

let idesign_ref_design_donts = {idesign|# Design "Don'ts" (Ch. 3 - Structure)

Red flags indicating functional decomposition or architectural violations. If you do any of these, treat it as a warning sign and investigate what you are missing.

## Call-Flow Violations

### Clients must not call multiple Managers in the same use case
- Doing so tightly couples Managers -- they no longer represent separate families of use cases, separate subsystems, or separate slices
- Chained Manager calls from the Client indicate functional decomposition: the Client is stitching together underlying functionalities
- Clients CAN call multiple Managers but NOT in the same use case (e.g., Client calls Manager A for use case 1, then Manager B for use case 2)

### Clients must not call Engines
- The only entry points to the business layer are the Managers
- Managers represent the system; Engines are an internal layer implementation detail
- If Clients call Engines, use case sequencing and associated volatility migrates to the Clients, polluting them with business logic
- Calls from Clients to Engines are the hallmark of functional decomposition

### Managers must not queue calls to more than one Manager in the same use case
- If two Managers receive a queued call, why not a third? Why not all of them?
- The need for multiple Managers to respond to a queued call is a strong indication you should use a Pub/Sub Utility service instead

### Engines must not receive queued calls
- Engines are utilitarian and exist to execute a volatile activity for a Manager
- They have no independent meaning on their own
- A queued call, by definition, executes independently from anything else in the system
- Performing just the activity of an Engine, disconnected from any use case or other activities, does not make any business sense

### ResourceAccess services must not receive queued calls
- Similar to the Engines guideline
- ResourceAccess services exist to service a Manager or an Engine and have no meaning on their own
- Accessing a Resource independently from anything else in the system does not make any business sense

### Engines never call each other
- Not only does this violate the closed architecture principle, it also does not make sense in a volatility-based decomposition
- The Engine should have already encapsulated everything to do with that activity
- Any Engine-to-Engine calls indicate functional decomposition

### ResourceAccess services never call each other
- If ResourceAccess services encapsulate the volatility of an atomic business verb, one atomic verb cannot require another
- Similar to the rule that Engines should not call each other
- Note: a 1:1 mapping between ResourceAccess and Resources is NOT required
- Often two or more Resources logically must be joined together to implement some atomic business verbs
- A single ResourceAccess service should perform the join rather than making inter-ResourceAccess calls

## Event/Pub-Sub Violations

### Clients must not publish events
- Events represent changes to the state of the system about which Clients (or Managers) may want to know
- A Client has no need to notify itself (or other Clients)
- Knowledge of the internals of the system is often required to detect the need to publish an event -- knowledge that the Clients should not have
- However, with functional decomposition the Client IS the system and needs to publish events

### Engines must not publish events
- Publishing an event requires noticing and responding to a change in the system
- This is typically a step in a use case executed by the Manager
- An Engine performing an activity has no way of knowing much about the context of the activity or the state of the use case

### ResourceAccess services must not publish events
- ResourceAccess services have no way of knowing the significance of the state of the Resource to the system
- Any such knowledge or responding behavior should reside in Managers

### Resources must not publish events
- The need for the Resource to publish events is often the result of a tightly coupled functional decomposition
- Similar to the case for ResourceAccess -- business logic of this kind should reside in Managers
- As a Manager modifies the state of the system, the Manager should also publish the appropriate events

### Engines, ResourceAccess, and Resources must not subscribe to events
- Processing an event is almost always the start of some use case, so it must be done in a Client or a Manager
- The Client may inform a user about the event, and the Manager may execute some back-end behavior
|idesign}

let idesign_ref_design_standard = {idesign|# Design Standard (Appendix C) -- System Design & Service Contract Parts

A consolidated checklist of all directives and guidelines from the book. A **directive** is a rule you should never violate -- doing so is certain to cause failure. A **guideline** is advice you should follow unless you have a strong and unusual justification for going against it. Violating a single guideline alone is not certain to cause failure, but too many violations will.

## The Prime Directive

**Never design against the requirements.**

## Directives (System Design)

1. Avoid functional decomposition.
2. Decompose based on volatility.
3. Provide a composable design.
4. Offer features as aspects of integration, not implementation.
5. Design iteratively, build incrementally.

## System Design Guidelines

### 1. Requirements

a. Capture required behavior, not required functionality.
b. Describe required behavior with use cases.
c. Document all use cases that contain nested conditions with activity diagrams.
d. Eliminate solutions masquerading as requirements.
e. Validate the system design by ensuring it supports all core use cases.

### 2. Cardinality

a. Avoid more than five Managers in a system without subsystems.
b. Avoid more than a handful of subsystems.
c. Avoid more than three Managers per subsystem.
d. Strive for a golden ratio of Engines to Managers.
e. Allow ResourceAccess components to access more than one Resource if necessary.

### 3. Attributes

a. Volatility should decrease top-down.
b. Reuse should increase top-down.
c. Do not encapsulate changes to the nature of the business.
d. Managers should be almost expendable.
e. Design should be symmetric.
f. Never use public communication channels for internal system interactions.

### 4. Layers

a. Avoid open architecture.
b. Avoid semi-closed/semi-open architecture.
c. Prefer a closed architecture.
   - i. Do not call up.
   - ii. Do not call sideways (except queued calls between Managers).
   - iii. Do not call more than one layer down.
   - iv. Resolve attempts at opening the architecture by using queued calls or asynchronous event publishing.
d. Extend the system by implementing subsystems.

### 5. Interaction Rules

a. All components can call Utilities.
b. Managers and Engines can call ResourceAccess.
c. Managers can call Engines.
d. Managers can queue calls to another Manager.

### 6. Interaction Don'ts

a. Clients do not call multiple Managers in the same use case.
b. Managers do not queue calls to more than one Manager in the same use case.
c. Engines do not receive queued calls.
d. ResourceAccess components do not receive queued calls.
e. Clients do not publish events.
f. Engines do not publish events.
g. ResourceAccess components do not publish events.
h. Resources do not publish events.
i. Engines, ResourceAccess, and Resources do not subscribe to events.

## Service Contract Design Guidelines

1. Design reusable service contracts.
2. Comply with service contract design metrics:
   - a. Avoid contracts with a single operation.
   - b. Strive to have 3 to 5 operations per service contract.
   - c. Avoid service contracts with more than 12 operations.
   - d. Reject service contracts with 20 or more operations.
3. Avoid property-like operations.
4. Limit the number of contracts per service to 1 or 2.
5. Avoid junior hand-offs.
6. Have only the architect or competent senior developers design the contracts.
|idesign}

let idesign_ref_contract_design = {idesign|# Service Contract Design (Appendix B)

## Modularity and Cost

Total system cost is the sum of two nonlinear cost elements:

### Cost per Service
- As the number of services decreases, their size increases (toward a monolith)
- Complexity increases nonlinearly with size: a service 2x as big may be 4x more complex; 4x as big may be 20-100x more complex
- Increased complexity induces nonlinear increases in cost
- Result: cost per service is a compounded, nonlinear, monotonically increasing function of size

### Integration Cost
- As the number of services increases, the complexity of possible interactions increases
- With n services, interaction complexity grows in proportion to n^2 or even n^n
- Integration cost is also a nonlinear curve, shooting up with more services

### Area of Minimum Cost
- The total system cost curve (sum of both) has a flat region: the **area of minimum cost**
- Services are not too big, not too small; not too many, not too few
- You do not need the absolute minimum -- just stay in the flat region (diminishing returns beyond that)
- What you MUST avoid: the nonlinear edges (monolith or explosion of services), which are many multiples more expensive
- **Functional decomposition always lands at the expensive edges** -- either a few massive accumulations or an explosion of small services
- Systems designed outside the area of minimum cost have already failed before anyone writes the first line of code -- because the tools organizations have (add another developer, another month) are linear, and the problem is nonlinear

## Services and Contracts

A **contract** is the public interface that the service presents to its clients -- a set of operations that clients can call. Not all interfaces are service contracts; service contracts are formal interfaces the service commits to support, unchanged.

### Contracts as Facets
- A contract represents a facet of the service (like an employment contract is one facet of a person)
- A single service can support more than one contract (multiple facets)
- The first reduction: assume a one-to-one ratio between services and contracts, then the cost curve behavior remains unchanged

### Attributes of Good Contracts

Good contracts are:

1. **Logically consistent** -- no unrelated operations bundled together. Every operation in the contract must logically belong with the others.
2. **Cohesive** -- all the aspects required to describe the interaction, no more, no less. Nothing missing, nothing extra.
3. **Independent** -- each contract (facet) stands alone and operates independently of other contracts.

**The basic element of reuse is the contract, not the service.** Good interfaces are reusable while the underlying services never are (like the tool-hand interface reused from stone axe to computer mouse).

Logically consistent, cohesive, and independent contracts ARE reusable contracts. Reusability is not binary -- it is a spectrum. The more a contract has these three attributes, the more reusable it is.

## Factoring Contracts

Design contracts as if they will be reused countless times across multiple systems including your competitors'. The degree of actual reuse is immaterial -- the obligation to design reusable contracts keeps you in the area of minimum cost.

### Factoring Down (Base Extraction)
- Extract a base contract from a more specific contract
- When a contract has operations that are not universally applicable, factor the general operations into a base contract and keep the specific ones in a derived contract
- Example: `IScannerAccess` has `ScanCode()` and `AdjustBeam()` -- but `AdjustBeam()` is scanner-specific. Factor down to `IReaderAccess` (base with `ReadCode()`) and `IScannerAccess : IReaderAccess` (derived with `AdjustBeam()`)
- This enables non-optical devices (keypads, RFID readers) to implement `IReaderAccess`

### Factoring Sideways (Separating Concerns)
- Separate logically unrelated operations into independent contracts
- When a contract is not logically consistent (grab-bag of unrelated operations), split it
- Example: `IReaderAccess` with `ReadCode()`, `OpenPort()`, `ClosePort()` -- port management is a different concern than code reading. Factor sideways into `IReaderAccess` and `ICommunicationDevice`
- Services implement both contracts; other devices (conveyer belts) can reuse just `ICommunicationDevice`
- Every change in business domain should NOT lead to a reflected change in the design -- that is the hallmark of bad design

### Factoring Up (Contract Hierarchy)
- Create a shared base contract when identical operations appear in multiple unrelated contracts
- Example: all devices need `Abort()` and `RunDiagnostics()` -- factor up to `IDeviceControl` base contract
- Both `IReaderAccess` and `IBeltAccess` derive from `IDeviceControl`

## Contract Design Metrics

Metrics are **evaluation tools, not validation tools**. Complying does not guarantee a good design, but violating implies a bad design.

### Size Metrics (Operations per Contract)

| Operations | Assessment |
|-----------|------------|
| 1 | Red flag -- investigate. A single-operation facet is suspect |
| 2 | Possibly fine, but examine carefully |
| **3-5** | **Optimal range** |
| 6-9 | Acceptable, but starting to drift from area of minimum cost |
| 12+ | Very likely a poor design -- look for ways to factor |
| 20+ | **Immediately reject** -- no possible circumstances where this is benign |

### Avoid Properties
- Do not expose property-like operations (getters/setters) in service contracts
- Properties imply state and implementation details -- when the service changes, the client must change
- Good interactions are always behavioral: `DoSomething()`, `Abort()` -- not `GetName()`, `SetName()`
- Keep data where the data is; only invoke operations on it

### Limit the Number of Contracts per Service
- A service should support no more than 1 or 2 contracts
- If a service supports 3+ independent facets, the service may be too big
- In order of magnitude: 1-4 contracts per service, with PERT estimate of ~2.2
- In practice: most well-designed services have 1 or 2 contracts
- Tip: if your architecture has 8+ Managers, represent some Managers as additional independent facets (contracts) on other Managers to reduce the count

### Using Metrics
- Do NOT try to design to the metrics -- contract design is iterative
- Spend time identifying the reusable contract, keep examining if they are logically consistent, cohesive, and independent
- If you violate the metrics, keep working until you have decent contracts
- Once you have devised good contracts, you will find that they match the metrics naturally

## The Contract Design Challenge

- Designing contracts is an acquired skill requiring practice and mentorship
- The ideas are simple but not simplistic
- The real challenge is not designing the contracts but getting management support for the time investment
- Rushing to implementation with poor contracts will cause the project to fail (nonlinear cost consequences)
- With junior teams: the architect must design the contracts or closely guide the process
- Make contract design part of each service life cycle
|idesign}

let idesign_ref_design_example = {idesign|# System Design Example: TradeMe (Ch. 5)

A complete case study demonstrating The Method applied to a real system. Focus on the **thought process and rationale**, not on copying the specific outcome -- every system is different.

## System Overview

**TradeMe** is a marketplace system for matching tradesmen (plumbers, electricians, etc.) to contractors and construction projects. Think of it as a brokerage platform.

- **Tradesmen**: Self-employed skilled workers with skill levels, certifications, geographic areas, expected pay rates
- **Contractors**: Need tradesmen on an ad hoc basis (days to weeks), list projects with required trades, skills, location, rates, duration
- **Revenue model**: Spread between tradesman ask rate and contractor bid rate + membership fees
- **Operations**: 9 call centers across Europe, ~220 account reps, locale-specific regulations
- **Legacy system**: Two-tier desktop app, 5 disconnected subsystems, business logic in clients, no security design, change-resistant

**Goals for new system**: Automate work, single system across all locales, deploy beyond Europe, compete with more flexible competitors.

## Use Cases and Core Use Case Identification

The customer provided 8 use cases (mostly reflecting legacy behavior):
1. Add Tradesman/Contractor
2. Request Tradesman
3. Match Tradesman
4. Assign Tradesman
5. Terminate Tradesman
6. Pay Tradesman
7. Create Project
8. Close Project

### Finding the Core Use Case

Most provided use cases were simple functionalities (add member, create project, pay someone) that any design can handle. The system's raison d'etre is **matching tradesmen to contractors and projects**. Only **Match Tradesman** resembles the core purpose.

**Principles**:
- Core use cases represent the essence of the business (2-6 per system)
- They are rarely presented explicitly in requirements
- They are almost always abstractions of other use cases
- Even flawed requirements contain them because they ARE the business
- Do NOT ignore non-core use cases -- demonstrating that the design easily supports them shows the design's versatility

### Simplifying Use Cases

**Swim lanes technique**: Show flow of control between roles. For TradeMe, three role types were identified:
- **Client** (users -- back-office reps or system admins)
- **Market** (core marketplace logic)
- **Member** (tradesmen and contractors)

Swim lanes help clarify required behavior, add decision boxes or synchronization bars, and are later used to seed and validate the design.

## The Anti-Design Effort

Deliberately produce the **worst possible design** through functional decomposition, to expose what NOT to do.

### Anti-Design #1: The Monolith
A single god service -- dumping ground of all functionalities. No encapsulation. Cannot validate.

### Anti-Design #2: Granular Building Blocks (Services Explosion)
Every activity in the use cases becomes a component. Results in either:
- **Fat client**: Client absorbs all business logic (orchestration, sequencing, error compensation)
- **Chained services**: Services call each other up and sideways -- tight coupling, open architecture

### Anti-Design #3: Domain Decomposition
Decompose along entity lines (Tradesman service, Contractor service, Project service). Nearly limitless possible domain boundaries with no principled selection criteria. Impossible to validate -- a request touches multiple domains. Has all drawbacks from Chapter 2.

## Business Alignment

### The Vision
> *A platform for building applications to support the TradeMe marketplace.*

- Terse and explicit -- read like a legal statement
- "Platform" (not just "application") addresses business need for diversity and extensibility
- Powerful tool for **repelling irrelevant demands** that do not serve the vision

### The Business Objectives (7 items)
1. Unify repositories and applications
2. Quick turnaround for new requirements
3. High degree of customization across countries/markets
4. Full business visibility and accountability (fraud detection, audit)
5. Forward looking on technology and regulations
6. Integrate well with external systems
7. Streamline security

**Note**: Development cost was NOT an objective. The pain was in the items above.

### The Mission Statement
> *Design and build a collection of software components that the development team can assemble into applications and features.*

Deliberately does NOT identify developing features as the mission. The mission is to **build components** -- making volatility-based decomposition the natural approach.

### The Chain
```
Vision → Objectives → Mission Statement → Architecture
```
This **reverses typical dynamics**: instead of the architect pleading with management, you compel the business to instruct you to design the right architecture. Once they agree on the chain, they are on your side.

## Volatility Identification

### Glossary (Who/What/How/Where)
Before decomposing, answer four questions to seed the effort:

- **Who**: Tradesmen, Contractors, Reps, Education centers, Background processes (timers)
- **What**: Membership, Marketplace of projects, Certificates/training
- **How**: Searching, Complying with regulations, Accessing resources
- **Where**: Local database, Cloud, Other systems

The "what" list hints strongly at possible subsystems. Use it to **seed decomposition** as you look for volatilities.

### Rejected/Reframed Volatility Candidates

| Candidate | Verdict | Reason |
|-----------|---------|--------|
| **Tradesman** | Rejected | Variable, not volatile. Adding attributes doesn't change architecture. Signals domain decomposition. Real volatility is *membership management*. |
| **Education certificates** | Reframed | Certification itself is just an attribute. Real volatility is in the *workflow of matching regulations with certifications* (→ Regulation Engine). |
| **Projects** | Reframed | A `Project Manager` implies domain decomposition. A `Market Manager` is better -- many activities don't require a project context. Core volatility is *the marketplace*. |
| **Payments** | Outside system | Volatile but ancillary. TradeMe is not a payment system. Handled as external *Resources*. |
| **Notification** | Weak | Message Bus Utility suffices. Only if notification transport became strongly volatile would a dedicated Manager be needed. |
| **Analysis** | Rejected | Speculative design. The company is not in the optimization business. Folded into Market Manager if ever needed. |

**Principle**: If identifying a volatility produces domain decomposition along entity lines, look further. You must clearly state: WHAT the volatility is, WHY it is volatile, WHAT RISK it poses.

### Accepted Areas of Volatility

| Volatility Area | Encapsulated In | Notes |
|---|---|---|
| Client applications | Individual Client apps | Each client environment evolves independently |
| Managing membership | `Membership Manager` | Adding/removing members, benefits, discounts |
| Fees | `Market Manager` | All ways TradeMe makes money |
| Projects | `Market Manager` | NOT a separate Project service |
| Disputes | `Membership Manager` | Misunderstandings, fraud |
| Matching and approvals | `Search Engine` + `Market Manager` | Two sub-volatilities: algorithm + criteria definition |
| Education | `Education Manager` + `Search Engine` | Training workflow + class searching |
| Regulations | `Regulation Engine` | Changes per country and over time |
| Reports | `Regulation Engine` | Reporting and auditing requirements |
| Localization | `Clients` (UI) + `Regulation Engine` (rules) | Two distinct sub-volatilities |
| Resources (storage) | `ResourceAccess` + `Resources` | Storage nature is volatile |
| Deployment model | Subsystem composition + `Message Bus` | Cloud vs on-premise, data locality |
| Authentication/authorization | `Security` Utility | Credential models, identity, roles |

**Key**: The mapping of volatilities to components is NOT 1:1. A single Manager can encapsulate multiple related volatilities.

## Static Architecture

```
CLIENT TIER:
  Tradesman Portal | Contractors Portal | Education Portal | Marketplace App | Timer

UTILITIES (vertical bar):
  Security | Logging | Message Bus

BUSINESS LOGIC TIER:
  Membership Manager | Market Manager | Education Manager
  Regulation Engine | Search Engine

RESOURCE ACCESS TIER:
  Regulations Access | Payments Access | Members Access
  Projects Access | Contractors Access | Education Access | Workflows Access

RESOURCES TIER:
  Regulations | Payments | Members | Projects | Contractors | Education | Workflows
```

### Key Observations
- **3 Managers** (Membership, Market, Education) -- within cardinality guidelines
- **2 Engines** (Regulation, Search) -- golden ratio to Managers
- **Timer** is in Client tier because it initiates behavior even though it's not part of the system
- **ResourceAccess** converts atomic business verbs (e.g., "pay") into resource access
- **3 Utilities**: Security, Message Bus, Logging

## Operational Concepts

### All Communication via Message Bus
All Client-to-Manager communication happens over the Message Bus. Clients and Managers never interact directly -- they are unaware of each other, fostering extensibility and independent evolution.

### Message Bus Properties
- Queued Pub/Sub mechanism: N:M communication
- Messages queue if bus or publisher is down, process when connectivity restores
- Private queue per subscriber handles subscriber downtime
- Minimum features: queuing, multicast, security, headers/context propagation, offline work, failure handling, transactional processing, high throughput, multiple-protocol support, reliable messaging

### "The Message Is the Application" Pattern

The most important operational concept. There is no single collection of components you can point to as "the application." The system is a loose collection of services posting and receiving messages. Each service processes a message, does local work, posts back to the bus. Behavior changes are induced by changing how services respond to messages, not by changing the architecture.

**When NOT to use**: Adds complexity. A simpler design where Clients just queue calls to Managers may suffice. Calibrate to the capability of the developers and management.

## Workflow Manager Pattern

A Manager that can create, store, retrieve, and execute workflows using a third-party workflow execution tool.

**How it operates**:
1. For each Client call, load the correct workflow type AND specific instance (with state/context)
2. Execute the workflow
3. Persist the workflow instance back to the workflow store
4. No session with the Client -- state-aware through workflow persistence
5. Each call carries the unique workflow instance ID

**Benefits**:
- To add/change a feature, change the *workflows*, not the participating services
- Product owners or end users can edit workflows (with safeguards)
- Enables high degree of customization across markets
- Software team focuses on core services rather than chasing requirement changes

## Design Validation

Validate the architecture BEFORE work commences by showing the call chain for each use case.

### Validation Pattern (Self-Similar Across All Use Cases)
1. A Client posts to the Message Bus
2. A Manager (workflow-based) picks up the message and loads the appropriate workflow
3. The Manager consults Engines and/or ResourceAccess components
4. The Manager posts results back to the Message Bus
5. Other Managers and/or Clients respond to the posted message

### Use Case Validations Summary

**Add Tradesman/Contractor**: Client → Message Bus → Membership Manager (loads workflow from Workflows Access) → Regulation Engine + Payments Access + Members Access

**Request Tradesman**: Client → Message Bus → Market Manager (loads workflow) → Regulation Engine + Projects Access. Posts back to bus triggering Match Tradesman.

**Match Tradesman** (core use case): Client/Timer → Message Bus → Market Manager → Search Engine + Members Access + Projects Access + Contractors Access. Posts to bus → triggers Membership Manager for Assign.

**Assign Tradesman**: Message Bus → Membership Manager → Regulation Engine + Members Access. Posts to bus → Market Manager → Projects Access. Collaborative execution between two Managers via bus.

**Terminate Tradesman**: Client → Message Bus → Market Manager → Projects Access. Posts to bus → Membership Manager → Regulation Engine + Members Access. Flow can also run in **reverse direction** (tradesman-initiated).

**Pay Tradesman**: Timer → Message Bus → Market Manager → Workflows Access + Payments Access (→ external payment system).

**Create Project**: Client → Message Bus → Market Manager → Workflows Access + Projects Access. Simple, handled entirely by one Manager.

**Close Project**: Client → Message Bus → Market Manager → Projects Access. Posts to bus → Membership Manager → Regulation Engine + Members Access. Same pattern as Terminate Tradesman -- reinforces self-similarity.

### Cross-Cutting Patterns

- **Self-similarity and symmetry**: Every call chain follows the same structural pattern. This is a hallmark of good design.
- **Use case chaining**: Request → Match → Assign → Pay. Each operates independently, chaining through messages on the bus.
- **Bidirectional flow**: Same architecture supports flows from different initiators (contractor-initiated vs tradesman-initiated termination).
- **Composability**: New capabilities added by subscribing new services to existing messages or adding new workflows -- no modification of existing components.

## Principles Demonstrated

1. Design takes hours to days, not months (TradeMe: less than a week, two-person team)
2. Always transform, clarify, and consolidate raw requirements
3. The anti-design effort exposes what NOT to do
4. Business alignment (Vision → Objectives → Mission → Architecture) gets the business on your side
5. Candidate volatilities must be rigorously challenged -- entities as volatilities signal domain decomposition
6. Distinguish variable (data changes) from volatile (behavior/structure changes)
7. Volatility may reside outside the system (payments as external Resources)
8. The mapping of volatilities to components is not 1:1
9. Self-similarity and symmetry in call chains validate the design
10. The design is open-ended -- extend by adding more services or workflows, never by modifying existing ones
|idesign}

let frontend_design_skill = {frontend|---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
|frontend}

let systemd_unit name =
  Printf.sprintf
    {|[Unit]
Description=smock (well app)
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/smock
ExecStart=/srv/smock/bin/smock
Restart=on-failure
RestartSec=3

# Environment
Environment=PORT=4000
# Environment=WELL_DOMAIN=example.com

# Hardening
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/srv/smock/data
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
