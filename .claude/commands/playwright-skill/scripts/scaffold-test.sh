#!/usr/bin/env bash
# Usage: bash scripts/scaffold-test.sh <PageName>
# Example: bash scripts/scaffold-test.sh Login
# Creates: tests/login.spec.ts  +  tests/page-objects/LoginPage.ts

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <PageName>  (e.g. Login, Dashboard, Checkout)"
  exit 1
fi

NAME="$1"                          # e.g. Login
LOWER="${NAME,,}"                  # e.g. login
SPEC="tests/${LOWER}.spec.ts"
POM="tests/page-objects/${NAME}Page.ts"
TEMPLATE_SPEC=".claude/commands/playwright-skill/assets/spec-template.ts"
TEMPLATE_POM=".claude/commands/playwright-skill/assets/pom-template.ts"

mkdir -p tests/page-objects

if [[ -f "$SPEC" ]]; then
  echo "Already exists: $SPEC"
else
  sed "s/___/${NAME}/g" "$TEMPLATE_SPEC" > "$SPEC"
  echo "Created: $SPEC"
fi

if [[ -f "$POM" ]]; then
  echo "Already exists: $POM"
else
  sed "s/___/${NAME}/g" "$TEMPLATE_POM" > "$POM"
  echo "Created: $POM"
fi
