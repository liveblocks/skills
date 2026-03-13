---
name: "liveblocks-best-practices"
description: "TODO"
license: "Apache License 2.0"
metadata:
  author: "liveblocks"
  version: "1.0.0"
---

# Liveblocks best practices

## When to use this skill

Use this skill when implementing features using any Liveblocks packages, for
example [`@liveblocks/react`](https://www.npmjs.com/package/@liveblocks/react)
or [`@liveblocks/node`](https://www.npmjs.com/package/@liveblocks/node).

TODO maybe do bullet points

## Quick reference

- `suspense-vs-regular-hooks`: You must read this when using any Liveblocks
  hooks.
- `rendering-loading-components`: Use `ClientSideSuspense` to performantly
  structure your app with loading skeletons and spinners.
- `rendering-error-components`: Use `ErrorBoundary` to structure your app with
  error fallbacks.
- `room-creation`: Always create rooms yourself in production applications.
