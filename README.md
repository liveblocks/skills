<p align="center">
  <a href="https://liveblocks.io#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-light.svg" alt="Liveblocks" />
  </a>
  <a href="https://liveblocks.io#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-dark.svg" alt="Liveblocks" />
  </a>
</p>

# Liveblocks skills

A collection of skills designed to help AI coding assistants help write
Liveblocks and Yjs code. Uses the [Agent Skills](https://agentskills.io/home)
format. Available as a plugin for Claude Code, Cursor, and OpenAI Codex.
Includes an MCP server for tool access.

## Install

### OpenAI Codex

Install the Codex plugin from the public marketplace source:

```bash
codex plugin marketplace add liveblocks/skills
codex plugin add liveblocks@liveblocks
```

After installation, start a new Codex thread so the Liveblocks skills and MCP
server are available.

### Other AI tools

Install with the following command:

```bash
npx skills add liveblocks/skills
```

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

## Repository layout

OpenAI Codex marketplaces expect a plugin folder referenced from
`.agents/plugins/marketplace.json`. To avoid duplicating files,
`plugins/liveblocks` is a symlink to this repository root.
