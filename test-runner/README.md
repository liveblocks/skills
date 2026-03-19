# Skills test runner

Runs skill evals with a real AI (OpenAI or Anthropic via
[Vercel AI SDK](https://sdk.vercel.ai)), grades responses against assertions,
and opens an HTML report in your browser.

## Setup

Install the project.

```bash
cd test-runner
npm install
```

Add _either_ of these keys in `.env.local`

```env
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

## Test files

Eval and trigger test data live in `test-runner/tests/` as flat files per skill:

- `tests/<skill>.evals.json` — output-quality evals (prompts + assertions)
- `tests/<skill>.trigger-evals.json` — trigger queries (query + should_trigger)

Example: `yjs-best-practices.evals.json`,
`yjs-best-practices.trigger-evals.json`. Also:
`liveblocks-best-practices.evals.json`,
`liveblocks-best-practices.trigger-evals.json`.

Skills are read from the repo `skills/<skill-name>/SKILL.md`.

**Trigger pass threshold:** In `src/run-triggers.ts`, set
`TRIGGER_PASS_THRESHOLD` (0–1) to the fraction of runs that must match the
expected trigger to pass. Default is `0.8` (80%): with 10 runs per query, at
least 8 must be correct.

## Scripts

| Script                            | What it runs                                    |
| --------------------------------- | ----------------------------------------------- |
| `npm run test:liveblocks`         | Evals + triggers for liveblocks-best-practices. |
| `npm run test:liveblocks:evals`   | Evals only for liveblocks.                      |
| `npm run test:liveblocks:trigger` | Triggers only for liveblocks.                   |
| `npm run test:yjs`                | Evals + triggers for yjs-best-practices.        |
| `npm run test:yjs:evals`          | Evals only for yjs.                             |
| `npm run test:yjs:trigger`        | Triggers only for yjs.                          |

Each run writes `output/report.html` (evals) and/or `output/report-trigger.html`
(triggers) and opens them in your browser.
