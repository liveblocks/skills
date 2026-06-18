<p align="center">
  <a href="https://liveblocks.io#gh-light-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-light.svg" alt="Liveblocks" />
  </a>
  <a href="https://liveblocks.io#gh-dark-mode-only">
    <img src="https://raw.githubusercontent.com/liveblocks/liveblocks/main/.github/assets/header-dark.svg" alt="Liveblocks" />
  </a>
</p>

# Liveblocks skills

Reusable agent skills for helping AI coding assistants write Liveblocks and Yjs
code.

This repository is the source of truth for skill content. The installable
Liveblocks plugin lives in
[`liveblocks/liveblocks-plugin`](https://github.com/liveblocks/liveblocks-plugin)
and vendors these skills alongside plugin metadata, assets, and MCP server
configuration.

## Install

For tools that support plugins, install the Liveblocks plugin:

```bash
npx plugins add liveblocks/liveblocks-plugin
```

For tools that only support standalone skills, install this repository directly:

```bash
npx skills add liveblocks/skills
```

## Skills

### `liveblocks-best-practices`

Best practices for using Liveblocks. Contains 40+ comprehensive references
related to each feature of Liveblocks. Use it when building, debugging, or
answering questions about Liveblocks.

### `yjs-best-practices`

Best practices for using Yjs. Contains info on fixing common issues,
structuring your data efficiently, and avoiding bugs. Use it when building,
debugging, or answering questions about Yjs.

## Development

Skill content lives in `skills/`.

The test runner in `test-runner/` contains trigger and answer evals for the
skills.

The plugin repository owns plugin manifests, marketplace metadata, assets,
README, MCP configuration, and any automation that vendors these skills.
