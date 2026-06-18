<p align="center">
  <a href="https://liveblocks.io#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-light.svg" alt="Liveblocks" />
  </a>
  <a href="https://liveblocks.io#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-dark.svg" alt="Liveblocks" />
  </a>
</p>

# Liveblocks plugin

The Liveblocks plugin helps AI coding assistants write Liveblocks and Yjs code.
It bundles agent skills and MCP server configuration, and is available for
Claude Code, Cursor, and OpenAI Codex.

## Install

Install the Liveblocks plugin:

```bash
npx plugins add liveblocks/liveblocks-plugin
```

After installation, start a new thread in your AI coding tool so the Liveblocks
skills and MCP server are available.

## Supported tools

| Tool | Status |
|---|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Supported |
| [OpenAI Codex](https://openai.com/codex) | Supported |
| [Cursor](https://www.cursor.com/) | Supported |

## Available skills

| Skill | Description | Source |
|---|---|---|
| [`liveblocks-best-practices`](./skills/liveblocks-best-practices) | Best practices for Liveblocks rooms, auth, presence, Storage, comments, notifications, text editors, React patterns, and more. | Authored here |
| [`yjs-best-practices`](./skills/yjs-best-practices) | Guidance for Yjs data modeling, updates, performance, subdocuments, providers, and common debugging issues. | Authored here |

## MCP server

The plugin includes the
[Liveblocks MCP server](https://github.com/liveblocks/liveblocks-mcp-server),
giving agents tool access to create, modify, and delete different aspects of
Liveblocks such as rooms, threads, comments, notifications, and more. It also
has read access to Storage and Yjs.

Set a development project secret key before starting your coding agent:

```bash
export LIVEBLOCKS_SECRET_KEY="sk_..."
```

Do not use a production secret key. The MCP server gives your agent direct
access to inspect and modify data in that Liveblocks project.

## When to use

After installation, skills are automatically available in your AI tool. Your
agent will use them when it judges they are relevant.

### Examples

```
How do I handle unstable Wi-Fi connections with Liveblocks?
```

```
How do I pass custom headers to my auth endpoint?
```

```
Why is my Y.Map growing so large?
```

## Plugins

This repo serves as a plugin for multiple platforms:

- **Claude Code** — `.claude-plugin/`
- **Cursor** — `.cursor-plugin/`
- **OpenAI Codex** — `.codex-plugin/`

`liveblocks/skills` is the source of truth. The
`liveblocks/liveblocks-plugin` repository is generated from this repo so users
can install from a plugin-named repository.

## Repository layout

OpenAI Codex marketplaces expect a plugin folder referenced from
`.agents/plugins/marketplace.json`. To avoid duplicating files,
`plugins/liveblocks` is a symlink to this repository root.
