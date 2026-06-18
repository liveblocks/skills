<p align="center">
  <a href="https://liveblocks.io#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-light.svg" alt="Liveblocks" />
  </a>
  <a href="https://liveblocks.io#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-dark.svg" alt="Liveblocks" />
  </a>
</p>

# Liveblocks skills

Agent skills for building Liveblocks and Yjs apps.

Supports Claude Code, Codex, Cursor, and other skills-compatible coding agents.

[![skills.sh](https://skills.sh/b/liveblocks/skills)](https://skills.sh/liveblocks/skills)

## Install Skills

Install the standalone skills:

```bash
npx skills add liveblocks/skills
```

## Install the Plugin

For supported tools, install the
[Liveblocks plugin](https://github.com/liveblocks/liveblocks-plugin). It bundles
these skills with the Liveblocks MCP server configuration.

```bash
npx plugins add liveblocks/liveblocks-plugin
```

## Skills

| Skill                                                             | Description                                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`liveblocks-best-practices`](./skills/liveblocks-best-practices) | Best practices for Liveblocks rooms, auth, presence, Storage, comments, notifications, text editors, React patterns, and more. |
| [`yjs-best-practices`](./skills/yjs-best-practices)               | Guidance for Yjs data modeling, updates, performance, subdocuments, providers, and common debugging issues.                    |
