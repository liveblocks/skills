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
- `type-liveblocks-correctly`: Always use TypeScript to type Liveblocks where
  available. Presence, others, user info, storage, metadata, room info,
  notifications activities, can all be automatically typed.
- `dark-mode-styles`: You can import CSS styling for dark mode themes.
- `override-css-variables`: Add custom styles to the default components by
  overriding Liveblocks CSS variables.
- `z-index-issues`: Fix z-index problems by targeting portaled elements.
- `edit-component-text-strings`: Override strings in default components, such as
  button values, tooltip text, error text, more. Also helpful for setting other
  languages.
- `create-custom-comment-composer`: Build your own commenting composer (advanced
  use cases only).
- `smoother-realtime-updates`: Make presence and storage run at a higher frame
  rate, appearing more smooth. using this option, pdates can be received more
  frequently.
- `prevent-unsaved-changes-being-lost` Stop losing losing unsynched or unsaved
  changes.
- `remove-liveblocks-branding`: A Liveblocks logo badge appears in the bottom
  right of the screen, this is how to remove it.
- `log-out-of-liveblocks`: Rarely useful, but helpful in specific SPA situations
  where you cannot navigate the page to log out.
- `offline-support-in-text-editors`: Give your text editors the illusion of a
  quicker load time.
- `multiple-text-editors`: Add multiple Tiptap or BlockNote editors to the same
  page. Optionally use Storage to hold their field IDs.
- `create-custom-text-editor-toolbar`: Set up a styled toolbar, static or
  floating next to your selection, in Tiptap and Lexical.
- `ai-as-a-collaborator`: Use agentic workflows to allow AI to collaborate like
  a human inside your Liveblocks application.
- `ai-chats-with-tools-knowledge-components`: Set up and troubleshoot chats with
  RAG, knowledge, custom components, tool calling, custom models. Different to
  AI as a collaborator, as it is NOT workflow based.
- `primitive-components-parts`: Use primitives to create custom components or to
  merge components from your design system into Liveblocks UI.
- `utility-components`: Import a ready-made emoji picker, or human-readable
  timestamps, durations, file sizes.
- `trigger-custom-notifications`: Trigger any kind of notification in your
  inbox, even those unrelated to commenting.
- `develop-and-test-locally`: Set up a local dev server, and use it for
  Continuous Integration (CI) and End-to-End (E2E) testing. Connect to your app
  not online.
- `devtools-extension`: Inspect Liveblocks Storage, Yjs, presence, events, and
  connected users with DevTools extgensions for Chrome, Firefox, Edge.
- `tiptap-best-practices`: Server-side rendering, starter kit extensions,
  initial content, unsaved changes, more.
- `yjs-best-practices`: YKeyValue, subdocuments, V2 encoding, double imports,
  getYjsProviderForRoom. NOT relevant if you're using Tiptap, BlockNote, or
  Lexical.
- `create-custom-realtime-multiplayer`: Use Liveblocks Storage to build fully
  custom conflict-resolved multiplayer apps, like Figmaa, Pitch, Spline. Helpful
  for one-off realtime features too, like simple properties in a document.
- `authenticating-with-id-tokens`: Recommended method for authenticating users
  with their ID and info, best for complex permissions.
- `authenticating-with-access-tokens`: Alternative method for authenticating
  users with their ID and info, best for very simple permissions.
- `compartmentalize-resources-with-organizations`: Use organizations to create
  workspaces/tenants and compartmentalize resources, such as rooms,
  notifications, comment threads, and more. You can filter by organization when
  listing rooms and more.
- `url-params-in-room-id`: Use URL params in room IDs to create rooms, and
  incorporate document titles in the URL.

## TODO

- `adding-users-to-liveblocks`: ...
- handling users that cant auth
- share menu
- performant others
- performant storage
