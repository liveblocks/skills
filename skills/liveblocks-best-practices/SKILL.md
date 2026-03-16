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
- `handling-unstable-connections`: Implement fallbacks and error messages when
  users have poor network conditions.
- `handling-connection-errors`: Handle problems joining rooms because of
  permissions, authentication, changed room IDs.
- `handling-hook-and-component-errors`: Handle errors caused by hooks and
  pre-built components.
- `handling-full-rooms`: Handle problems caused by joining full rooms.
- `avoid-hitting-user-limit-in-rooms`: How to avoid rooms filling up with users.
- `create-rooms-manually`: Always create rooms yourself in production
  applications, setting permissions, organization, metadata.
- `customize-thread-components`: Use slots to customize comments inside of
  threads, and their different parts.
- `type-liveblocks-correctly`: Always type Liveblocks. Presence, others, user
  info, storage, metadata, room info, notifications activities, can all be
  automatically typed.
- `dark-mode-styles`: You can import CSS styling for dark mode themes.
- `override-css-variables`: Add custom styles to the default components by
  overriding Liveblocks CSS variables.
- `z-index-issues`: Fix z-index problems by targeting portaled elements.
- `edit-component-text-strings`: Override strings in default components, such as
  button values, tooltip text, error text, more. Also helpful for setting other
  languages.
- `create-custom-comment-composer`: Build your own commenting composer (advanved
  use cases only).

## TODO

- `authenticating-with-id-tokens`: ...
- `authenticating-with-access-tokens`: ...
- `adding-users-to-liveblocks`: ...
