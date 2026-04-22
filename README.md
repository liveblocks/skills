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

Install with the following command:

```bash
npx skills add liveblocks/skills
```

## Skills

### `liveblocks-best-practices`

Best practices for using Liveblocks. Contains 40+ comprehensive references
related to each feature of Liveblocks. Use it when building, debugging, or
answering questions about Liveblocks.

### `yjs-best-practices`

Best practices for using Yjs. Contains info on fixing common issues, structuring
your data efficiently, and avoiding bugs. Use it when building, debugging, or
answering questions about Yjs.

## Usage

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

## MCP Server

The plugin includes the
[Liveblocks MCP server](https://github.com/liveblocks/liveblocks-mcp-server),
giving agents tool access to create, modify, and delete different aspects of
Liveblocks such as rooms, threads, comments, notifications, and more. It also
has read access to Storage and Yjs.

## Plugins

This repo serves as a plugin for multiple platforms:

- **Claude Code** — `.claude-plugin/`
- **Cursor** — `.cursor-plugin/`
- **OpenAI Codex** — `.codex-plugin/`
