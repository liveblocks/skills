#!/usr/bin/env bash

# Removes symlinks created by the other script
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
  for dir in "$SOURCE"/*/; do
    if [[ -d "$dir" ]]; then
      name="$(basename "$dir")"
      target="$DEST/$name"
      if [[ -L "$target" ]]; then
        rm "$target"
        echo "Removed $target"
      elif [[ -e "$target" ]]; then
        echo "Skipping $target (not a symlink)" >&2
      fi
    fi
  done
done

echo "Done. Symlinks removed from: ${DESTINATIONS[*]}"
