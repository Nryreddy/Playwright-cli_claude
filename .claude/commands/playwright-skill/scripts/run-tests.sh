#!/usr/bin/env bash
# Usage: bash scripts/run-tests.sh [file] [browser] [--headed]
# Examples:
#   bash scripts/run-tests.sh                          # all tests
#   bash scripts/run-tests.sh tests/login.spec.ts      # single file
#   bash scripts/run-tests.sh tests/login.spec.ts chromium --headed

set -euo pipefail

FILE="${1:-}"
BROWSER="${2:-}"
HEADED="${3:-}"

CMD="npx playwright test"
[[ -n "$FILE"    ]] && CMD="$CMD $FILE"
[[ -n "$BROWSER" ]] && CMD="$CMD --project=$BROWSER"
[[ "$HEADED" == "--headed" ]] && CMD="$CMD --headed"

echo "Running: $CMD"
eval "$CMD"
