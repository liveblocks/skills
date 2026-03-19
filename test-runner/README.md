# Skills test runner

Runs skill evals with a real AI (OpenAI or Anthropic via [Vercel AI SDK](https://sdk.vercel.ai)), grades responses against assertions, and opens an HTML report in your browser.

## Setup

```bash
cd test-runner
npm install
```

Create a `.env` file (see `.env.example`) with either:

- `ANTHROPIC_API_KEY=...` — uses Claude (claude-sonnet-4)
- `OPENAI_API_KEY=...` — uses GPT-4o

## Test files

Eval and trigger test data live in `test-runner/tests/` as flat files per skill:

- `tests/<skill>.evals.json` — output-quality evals (prompts + assertions)
- `tests/<skill>.trigger-evals.json` — trigger queries (query + should_trigger)

Example: `yjs-best-practices.evals.json`, `yjs-best-practices.trigger-evals.json`. Also: `liveblocks-best-practices.evals.json`, `liveblocks-best-practices.trigger-evals.json`.

Skills are read from the repo `skills/<skill-name>/SKILL.md`.

**Trigger pass threshold:** In `src/run-triggers.ts`, set `TRIGGER_PASS_THRESHOLD` (0–1) to the fraction of runs that must match the expected trigger to pass. Default is `0.8` (80%): with 10 runs per query, at least 8 must be correct.

## Run

**Both evals and triggers** (default):

```bash
npm run eval
```

Runs output-quality evals and trigger queries for **yjs-best-practices** by default, writes `output/report.html` and `output/report-trigger.html`, and opens both in your browser.

**Evals only** (output-quality evals, 3 runs per eval; all run in parallel):

```bash
npm run eval:evals
# or
npm run eval -- --evals-only
```

**Triggers only** (10 runs per query; pass when ≥80% of runs match expectation):

```bash
npm run eval:trigger
# or
npm run eval -- --trigger
```

**Different skill** (use with any of the above):

```bash
npm run eval -- --skill liveblocks-best-practices
npm run eval:trigger -- --skill liveblocks-best-practices
```
