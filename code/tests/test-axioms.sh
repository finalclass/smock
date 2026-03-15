#!/bin/bash
# Axiom test framework
# Validates generated code against axiom requirements
# Usage: bash _generated/tests/test-axioms.sh

set -uo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0
ERRORS=()

pass() { PASS=$((PASS + 1)); echo "  PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); ERRORS+=("$1: $2"); echo "  FAIL: $1 — $2"; }

# --- File assertions ---

file_exists() {
  [ -f "$DIR/$1" ] && pass "$1 exists" || fail "$1 exists" "file not found"
}

has_layout() {
  grep -q "{{layout: $2}}" "$DIR/$1" 2>/dev/null && pass "$1 uses layout $2" || fail "$1 uses layout $2" "layout marker not found"
}

has_content() {
  grep -q "{{content}}" "$DIR/$1" 2>/dev/null && pass "$1 has content block" || fail "$1 has content block" "{{content}} not found"
}

has_text() {
  grep -qi "$3" "$DIR/$1" 2>/dev/null && pass "$1 contains '$2'" || fail "$1 contains '$2'" "text not found"
}

has_element() {
  grep -q "$3" "$DIR/$1" 2>/dev/null && pass "$1 has $2" || fail "$1 has $2" "element not found"
}

# --- @axiom marker assertions ---

has_axiom_markers() {
  grep -q '@axiom:' "$DIR/$1" 2>/dev/null && pass "$1 has @axiom markers" || fail "$1 has @axiom markers" "no @axiom markers found"
}

has_matched_markers() {
  local file="$DIR/$1"
  local opens closes
  # Count all opening and closing markers regardless of comment style
  opens=$(grep -c '@axiom:' "$file" 2>/dev/null || true)
  closes=$(grep -c '/@axiom:' "$file" 2>/dev/null || true)
  # opens includes closes (/@axiom contains @axiom), so subtract
  opens=$((opens - closes))
  [ "$opens" = "$closes" ] && pass "$1 markers matched ($opens pairs)" || fail "$1 markers matched" "opening=$opens closing=$closes"
}

has_valid_axiom_refs() {
  local file="$DIR/$1"
  local project_root
  project_root="$(cd "$DIR/.." && pwd)"
  local axioms_dir="$project_root/axioms"
  # Build list of valid namespace IDs from all axiom .md files
  local all_ns_ids=""
  for md_file in "$axioms_dir"/*.md "$axioms_dir"/*-client/*.md; do
    [ -f "$md_file" ] || continue
    local rel_path="${md_file#$axioms_dir/}"
    while IFS= read -r heading; do
      heading=$(echo "$heading" | sed 's/^#\{1,4\} //')
      local slug
      slug=$(echo "$heading" | tr '[:upper:]' '[:lower:]' | sed 's/ — /--/g' | sed 's/—/--/g' | sed "s/[\"'()\`{}:\/<>\"„]//g" | sed 's/ /-/g' | sed 's/^-//;s/-$//')
      all_ns_ids="$all_ns_ids
${rel_path}#${slug}"
      # Also generate ASCII-transliterated slug for Polish diacritics
      local slug_ascii
      slug_ascii=$(echo "$heading" | sed 's/ą/a/g; s/ć/c/g; s/ę/e/g; s/ł/l/g; s/ń/n/g; s/ó/o/g; s/ś/s/g; s/ź/z/g; s/ż/z/g; s/Ą/A/g; s/Ć/C/g; s/Ę/E/g; s/Ł/L/g; s/Ń/N/g; s/Ó/O/g; s/Ś/S/g; s/Ź/Z/g; s/Ż/Z/g' | tr '[:upper:]' '[:lower:]' | sed 's/ — /--/g' | sed 's/—/--/g' | sed "s/[\"'()\`{}:\/<>\"„]//g" | sed 's/ /-/g' | sed 's/^-//;s/-$//')
      if [ "$slug" != "$slug_ascii" ]; then
        all_ns_ids="$all_ns_ids
${rel_path}#${slug_ascii}"
      fi
    done < <(grep -E '^#{1,4} ' "$md_file" 2>/dev/null)
  done
  local invalid=0
  local invalid_names=""
  while IFS= read -r marker_name; do
    [ -z "$marker_name" ] && continue
    if ! echo "$all_ns_ids" | grep -qxF "$marker_name"; then
      invalid=$((invalid + 1))
      invalid_names="$invalid_names [$marker_name]"
    fi
  done < <(grep -ohP '(?<=@axiom: )\S+' "$file" 2>/dev/null | sed 's/ *\*\/$//;s/ *-->$//' | sort -u)
  [ "$invalid" = "0" ] && pass "$1 all axiom refs valid" || fail "$1 all axiom refs valid" "invalid:$invalid_names"
}

has_no_orphaned_content() {
  local file="$DIR/$1"
  local in_content=0 in_axiom=0 orphaned=0
  while IFS= read -r line; do
    if echo "$line" | grep -q '{{content}}'; then in_content=1; continue; fi
    if echo "$line" | grep -q '{{/content}}'; then in_content=0; continue; fi
    if [ "$in_content" = "0" ]; then continue; fi
    if echo "$line" | grep -q '@axiom:'; then in_axiom=$((in_axiom + 1)); continue; fi
    if echo "$line" | grep -q '/@axiom:'; then in_axiom=$((in_axiom - 1)); continue; fi
    if [ "$in_axiom" = "0" ]; then
      if echo "$line" | grep -qP '\S'; then
        orphaned=$((orphaned + 1))
      fi
    fi
  done < "$file"
  [ "$orphaned" = "0" ] && pass "$1 no orphaned content" || fail "$1 no orphaned content" "$orphaned lines outside @axiom blocks"
}

# === PROJECT-SPECIFIC TESTS ===
# Add your axiom tests below. Examples:
#
# echo "--- [test] My Feature ---"
# file_exists "my-page.html"
# has_layout "my-page.html" "layout-main.html"
# has_axiom_markers "my-page.html"
# has_text "my-page.html" "submit button" "Submit"

echo "=== Axiom Tests ==="
echo "Directory: $DIR"
echo ""

# --- @axiom markers verification ---
echo "--- @axiom markers verification ---"
while IFS= read -r f; do
  [ -f "$f" ] || continue
  fname="${f#$DIR/}"
  # Skip test files, node_modules, _build, dune.lock
  case "$fname" in
    tests/*|test/*|node_modules/*|_build/*|dune.lock/*|lib/contract/build/*|.opam/*|static/*.js|static/well.ts|playwright.config.ts|tsconfig.json) continue ;;
  esac
  has_axiom_markers "$fname"
  has_matched_markers "$fname"
  has_valid_axiom_refs "$fname"
done < <(find "$DIR" -type f \( -name "*.html" -o -name "*.sh" -o -name "*.js" -o -name "*.css" -o -name "*.ml" -o -name "*.mlx" -o -name "*.ts" \) ! -path "*/node_modules/*" ! -path "*/_build/*" ! -path "*/dune.lock/*")

echo ""
echo "--- @axiom orphaned content check ---"
for f in "$DIR"/*.html; do
  [ -f "$f" ] || continue
  fname=$(basename "$f")
  if grep -q '{{content}}' "$f" 2>/dev/null; then
    has_no_orphaned_content "$fname"
  fi
done

# -------------------------------------------------------
echo ""
echo "=========================================="
echo "RESULTS: $PASS passed, $FAIL failed"
echo "=========================================="
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo ""
  echo "Failures:"
  for e in "${ERRORS[@]}"; do
    echo "  - $e"
  done
  exit 1
fi
echo "All tests passed!"
exit 0
