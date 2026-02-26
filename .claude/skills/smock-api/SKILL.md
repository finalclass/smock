# Smock API — Upload Mockups

## Workflow

1. Create a project (one-time, needs SMOCK_ADMIN_KEY):
```bash
curl -X POST https://smock.finalclass.net/api/projects \
  -H "Authorization: Bearer $SMOCK_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project"}'
```
Response: `{"id": 1, "name": "My Project", "token": "abc12345", "api_key": "...", "created_at": "..."}`

2. Upload a mock (multipart, needs api_key):
```bash
curl -X POST https://smock.finalclass.net/api/projects/TOKEN/mocks \
  -H "Authorization: Bearer API_KEY" \
  -F "name=Homepage" \
  -F "files[]=@index.html" \
  -F "files[]=@css/style.css" \
  -F "files[]=@js/app.js"
```
File paths are preserved from filenames (e.g., `css/style.css`).

3. Client views mock at: `https://smock.finalclass.net/p/TOKEN/SLUG`

## Template System
- Add `{{layout: layout.html}}` at top of HTML file
- Wrap content in `{{content}}...{{/content}}`
- Layout uses `{{yield}}` where content goes
- Templates are processed at upload time

## Status Management
```bash
curl -X PUT https://smock.finalclass.net/api/projects/TOKEN/mocks/ID \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "review"}'
```
Statuses: draft, review, approved, rejected. Only non-draft mocks are visible to clients.

## Preparing Files for Upload
When asked to create and upload a mockup:
1. Create HTML/CSS/JS files in a temp directory
2. Use multipart upload with all files
3. Preserve directory structure in filenames
