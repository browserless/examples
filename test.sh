#!/usr/bin/env bash
# Smoke-tests every rest/nodejs and rest/python example against Browserless.
# Each script runs with YOUR_API_TOKEN_HERE replaced by the real token.
#
# Usage: BROWSERLESS_TOKEN=your_token bash test.sh

if [[ -z "${BROWSERLESS_TOKEN:-}" ]]; then
  echo "error: BROWSERLESS_TOKEN is not set"
  echo "usage: BROWSERLESS_TOKEN=your_token bash test.sh"
  exit 1
fi

EXAMPLES_DIR="$(cd "$(dirname "$0")/examples" && pwd)"
PASS=0
FAIL=0
TMPFILE_MJS=$(mktemp /tmp/bl-test-XXXXXX.mjs)
TMPFILE_PY=$(mktemp /tmp/bl-test-XXXXXX.py)
trap 'rm -f "$TMPFILE_MJS" "$TMPFILE_PY"' EXIT

run_example() {
  local file="$1" cmd="$2" tmpfile="$3"
  local name
  name=$(basename "$(dirname "$(dirname "$(dirname "$file")")")")
  sed "s/YOUR_API_TOKEN_HERE/$BROWSERLESS_TOKEN/g" "$file" > "$tmpfile"

  if output=$($cmd "$tmpfile" 2>&1); then
    printf "PASS  [%s]  %s\n" "$cmd" "$name"
    PASS=$((PASS + 1))
  else
    printf "FAIL  [%s]  %s\n" "$cmd" "$name"
    while IFS= read -r line; do
      printf "      %s\n" "$line"
    done <<< "$output"
    FAIL=$((FAIL + 1))
  fi
}

printf "=== Node.js ===\n"
for file in "$EXAMPLES_DIR"/*/rest/nodejs/*.mjs; do
  run_example "$file" "node" "$TMPFILE_MJS"
done

printf "\n=== Python ===\n"
for file in "$EXAMPLES_DIR"/*/rest/python/*.py; do
  run_example "$file" "python3" "$TMPFILE_PY"
done

# Clean up output files written by examples.
rm -f screenshot.png output.pdf dashboard.png screenshot-*.png
rm -rf images/

printf "\n%d passed, %d failed\n" "$PASS" "$FAIL"
[[ $FAIL -eq 0 ]]
