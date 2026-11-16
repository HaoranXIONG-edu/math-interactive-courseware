#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_SRC="$ROOT_DIR/.agents/skills/math-interactive-courseware"
GLOBAL_SKILL_DST="${HOME}/.gemini/config/skills/math-interactive-courseware"

echo "1. Syncing components/*.js -> .agents/skills/math-interactive-courseware/layers/*.js ..."
cp "$ROOT_DIR/components/math_components.js" "$SKILL_SRC/layers/math_components.js"
cp "$ROOT_DIR/components/ui_components.js" "$SKILL_SRC/layers/ui_components.js"
cp "$ROOT_DIR/components/annotation_components.js" "$SKILL_SRC/layers/annotation_components.js"
cp "$ROOT_DIR/components/courseware_components.js" "$SKILL_SRC/layers/courseware_components.js"

echo "2. Syncing $SKILL_SRC -> $GLOBAL_SKILL_DST ..."
mkdir -p "$GLOBAL_SKILL_DST/layers" "$GLOBAL_SKILL_DST/scripts"
cp "$SKILL_SRC/SKILL.md" "$GLOBAL_SKILL_DST/SKILL.md"
cp "$SKILL_SRC/LAYOUTS.md" "$GLOBAL_SKILL_DST/LAYOUTS.md"
cp "$SKILL_SRC/layers/"* "$GLOBAL_SKILL_DST/layers/"
cp "$SKILL_SRC/scripts/"* "$GLOBAL_SKILL_DST/scripts/"

# Keep legacy filenames in global skill synced if present
cp "$SKILL_SRC/layers/shell_prefix.html" "$GLOBAL_SKILL_DST/layers/seewo_shell_prefix.html"
cp "$SKILL_SRC/layers/shell_suffix.html" "$GLOBAL_SKILL_DST/layers/seewo_shell_suffix.html"

echo "Done! All skill layers and scripts are synchronized."
