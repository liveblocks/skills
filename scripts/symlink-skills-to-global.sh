#!/usr/bin/env bash

# Symlink all skill folders in this repo to:
DESTINATIONS=(
  "${HOME}/.claude/skills"
  "${HOME}/.codex/skills"
  "${HOME}/.cursor/skills"
  "${HOME}/.agents/skills"
)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE="$(cd "$REPO_ROOT/skills" && pwd)"

for DEST in "${DESTINATIONS[@]}"; do
  mkdir -p "$DEST"
  for dir in "$SOURCE"/*/; do
    if [[ -d "$dir" ]]; then
      name="$(basename "$dir")"
      target="$DEST/$name"
      [[ -e "$target" ]] && rm -rf "$target"
      ln -s "$dir" "$target"
      echo "Linked $name -> $target"
    fi
  done
done

echo "Done. Skills linked in: ${DESTINATIONS[*]}"
