import type { ReportData, TriggerReportData } from "./types.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

const LIGHT_THEME = `
  :root {
    --pass: #16a34a;
    --warn: #ca8a04;
    --fail: #dc2626;
    --bg: #ffffff;
    --bg-subtle: #fafafa;
    --border: #e5e5e5;
    --text: #171717;
    --text-muted: #737373;
  }
  * { box-sizing: border-box; }
  body {
    font-family: var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    margin: 0;
    padding: 2rem;
    max-width: 880px;
    margin-inline: auto;
    font-size: 15px;
  }
  .muted { color: var(--text-muted); font-size: 0.9em; }
  h1 { font-size: 1.5rem; font-weight: 600; margin: 0 0 0.25rem 0; letter-spacing: -0.02em; }
  h2 { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 0.75rem 0; }
  .result-badge {
    display: inline-block;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .result-badge.pass { background: #dcfce7; color: var(--pass); }
  .result-badge.warn { background: #fef9c3; color: #a16207; }
  .result-badge.fail { background: #fee2e2; color: var(--fail); }
  details { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.5rem; overflow: hidden; }
  details[open] { background: var(--bg-subtle); }
  summary {
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 500;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: ""; display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.5; }
  details[open] summary::before { background: var(--pass); opacity: 1; }
  details.fail summary::before { background: var(--fail); }
  .details-body { padding: 0 1rem 1rem; border-top: 1px solid var(--border); }
  .block { margin-top: 1rem; }
  .block:first-child { margin-top: 0; }
  .block-label { margin-top: 1rem; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.35rem; }
  .block pre, .block p { margin: 0; font-size: 0.875rem; }
  .block pre {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 0.75rem 1rem;
    border-radius: 6px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--font-geist-mono, ui-monospace, monospace);
    font-size: 0.8125rem;
  }
  .assertions { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .assertions th, .assertions td { padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
  .assertions th { color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .assertion-text { max-width: 280px; }
  .evidence { color: var(--text-muted); font-size: 0.8125rem; max-width: 320px; }
  tr.pass .result-badge { background: #dcfce7; color: var(--pass); }
  tr.fail .result-badge { background: #fee2e2; color: var(--fail); }
`;

export function generateHtmlReport(data: ReportData): string {
  const passRatePercent = (data.pass_rate * 100).toFixed(1);
  const overallClass =
    data.pass_rate >= 0.8 ? "pass" : data.pass_rate >= 0.5 ? "warn" : "fail";
  const allPassed = data.total_failed === 0;

  const resultsHtml = data.results
    .map((r) => {
      const runsPassed = r.summary.runsPassed ?? r.summary.passed;
      const runsTotalEval = r.summary.runsTotal ?? r.summary.total ?? 3;
      const evalPassRate =
        runsTotalEval > 0 ? (runsPassed / runsTotalEval) * 100 : 0;
      const evalClass =
        evalPassRate === 100 ? "pass" : evalPassRate >= 50 ? "warn" : "fail";
      const hasFail =
        (r.summary.runsPassed ?? r.summary.passed) <
        (r.summary.runsTotal ?? r.summary.total ?? 3);
      const meta = r.tokens
        ? ` · ${r.tokens.total} tokens · ${formatDuration(r.duration_ms)}`
        : "";

      const runsList =
        (r.runs ?? []).length > 0
          ? (r.runs ?? [])
              .map((run, idx) => {
                const runPassed = run.assertion_results.filter(
                  (a) => a.passed
                ).length;
                const runTotal = run.assertion_results.length;
                const runClass =
                  runPassed === runTotal
                    ? "pass"
                    : runPassed >= runTotal / 2
                      ? "warn"
                      : "fail";
                const runSummary = `Run ${idx + 1} — ${runPassed}/${runTotal} passed · ${formatDuration(run.duration_ms)}`;
                const runAssertionsRows = run.assertion_results
                  .map(
                    (a) =>
                      `<tr class="${a.passed ? "pass" : "fail"}">
                      <td class="assertion-text">${escapeHtml(a.text)}</td>
                      <td><div class="result-badge ${a.passed ? "pass" : "fail"}">${a.passed ? "PASS" : "FAIL"}</div></td>
                      <td class="evidence">${escapeHtml(a.evidence)}</td>
                    </tr>`
                  )
                  .join("");
                return `
                <details class="run-detail" data-run="${idx + 1}">
                  <summary><span class="result-badge ${runClass}">${runSummary}</span></summary>
                  <div class="details-body">
                    <div class="block">
                      <div class="block-label">Response</div>
                      <pre>${escapeHtml(run.response)}</pre>
                    </div>
                    <table class="assertions">
                      <thead><tr><th>Assertion</th><th>Result</th><th>Evidence</th></tr></thead>
                      <tbody>${runAssertionsRows}</tbody>
                    </table>
                  </div>
                </details>`;
              })
              .join("\n")
          : (() => {
              const assertionsRows = r.assertion_results
                .map((a) => {
                  const scoreLabel = a.score ? ` (${a.score})` : "";
                  return `<tr class="${a.passed ? "pass" : "fail"}">
                    <td class="assertion-text">${escapeHtml(a.text)}</td>
                    <td><div class="result-badge ${a.passed ? "pass" : "fail"}">${a.passed ? "PASS" : "FAIL"}${scoreLabel}</div></td>
                    <td class="evidence">${escapeHtml(a.evidence)}</td>
                  </tr>`;
                })
                .join("");
              return `<div class="block">
              <div class="block-label">Response</div>
              <pre>${escapeHtml(r.response)}</pre>
            </div>
            <table class="assertions">
              <thead><tr><th>Assertion</th><th>Result</th><th>Evidence</th></tr></thead>
              <tbody>${assertionsRows}</tbody>
            </table>`;
            })();

      return `
        <details class="eval-card ${hasFail ? "fail" : ""}" data-eval-id="${r.id}" ${hasFail ? "open" : ""}>
          <summary>
            <span>Eval #${r.id}</span>
            <span class="result-badge ${evalClass}">${runsPassed}/${runsTotalEval} runs</span>
            <span class="muted">${meta}</span>
          </summary>
          <div class="details-body">
            <div class="block">
              <div class="block-label">Prompt</div>
              <pre>${escapeHtml(r.prompt)}</pre>
            </div>
            <div class="block">
              <div class="block-label">Expected</div>
              <p>${escapeHtml(r.expected_output)}</p>
            </div>
            ${(r.runs ?? []).length > 0 ? `<div class="block"><div class="block-label">Runs</div>${runsList}</div>` : runsList}
          </div>
        </details>`;
    })
    .join("\n");

  const totalRuns = data.total_passed + data.total_failed;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eval Report: ${escapeHtml(data.skill_name)}</title>
  <style>${LIGHT_THEME}
  .summary-card {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
  }
  .summary-card h2 { margin-top: 0; }
  .summary-row { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; }
  .summary-row .result-badge { font-size: 0.875rem; padding: 0.25em 0.6em; }
  .summary-stats { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem; }
  .overall.${overallClass} { color: var(--${overallClass}); }
  .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .results-summary { font-size: 0.875rem; color: var(--text-muted); }
  .run-detail { margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .run-detail summary { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
  .run-detail .details-body { padding: 0 0.75rem 0.75rem; }
  </style>
</head>
<body>
  <h1>Eval Report</h1>
  <p class="muted">${escapeHtml(data.skill_name)} · ${data.run_at}</p>
  <section class="summary-card">
    <h2>Summary</h2>
    <div class="summary-row">
      <span class="result-badge ${overallClass}">${passRatePercent}%</span>
      <span class="overall ${overallClass}">${data.total_passed} / ${totalRuns} runs passed</span>
    </div>
    <div class="summary-stats">${data.total_evals} evals × 3 runs each · ${formatDuration(data.total_duration_ms)}</div>
  </section>
  <div class="results-header">
    <h2>Results</h2>
    ${allPassed ? `<span class="results-summary">All passed — expand to view details</span>` : ""}
  </div>
  ${resultsHtml}
</body>
</html>`;
}

export function generateTriggerReport(data: TriggerReportData): string {
  const passRatePercent = (data.pass_rate * 100).toFixed(1);
  const overallClass =
    data.pass_rate >= 0.8 ? "pass" : data.pass_rate >= 0.5 ? "warn" : "fail";
  const allPassed = data.failed === 0;

  const rows = data.results
    .map((r) => {
      const runsTotal = r.runsTotal ?? 10;
      const runsTriggered = r.runsTriggered ?? (r.triggered ? runsTotal : 0);
      const triggeredScore = `${runsTriggered}/${runsTotal}`;
      // "Correct" = runs that matched expectation (triggered when should, or didn't when shouldn't)
      const runsCorrect = r.should_trigger
        ? runsTriggered
        : runsTotal - runsTriggered;
      const correctScore = `${runsCorrect}/${runsTotal}`;
      const resultLabel =
        runsTotal > 0
          ? `${r.passed ? "PASS" : "FAIL"} (${correctScore})`
          : r.passed
            ? "PASS"
            : "FAIL";
      return `<tr class="${r.passed ? "pass" : "fail"}">
          <td class="query">${escapeHtml(r.query)}</td>
          <td>${r.should_trigger ? "Yes" : "No"}</td>
          <td>${triggeredScore}</td>
          <td><span class="result-badge ${r.passed ? "pass" : "fail"}">${resultLabel}</span></td>
          <td class="raw">${escapeHtml(r.raw_response ?? "")}</td>
        </tr>`;
    })
    .join("\n");

  const tableHtml = `
    <table class="trigger-table">
      <thead><tr><th>Query</th><th>Should trigger</th><th>Triggered</th><th>Result</th><th>Model response</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Trigger report: ${escapeHtml(data.skill_name)}</title>
  <style>${LIGHT_THEME}
  .summary-card {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
  }
  .summary-card h2 { margin-top: 0; }
  .summary-row { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; }
  .summary-row .result-badge { font-size: 0.875rem; padding: 0.25em 0.6em; }
  .summary-stats { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem; }
  .overall.${overallClass} { color: var(--${overallClass}); font-weight: 500; }
  details.trigger-details { margin-top: 0.75rem; }
  details.trigger-details summary { font-size: 0.875rem; color: var(--text-muted); }
  .trigger-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .trigger-table th, .trigger-table td { padding: 0.6rem 0.75rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
  .trigger-table th { color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .query { max-width: 340px; word-break: break-word; }
  .raw { font-size: 0.8125rem; color: var(--text-muted); max-width: 180px; font-family: var(--font-geist-mono, ui-monospace, monospace); }
  </style>
</head>
<body>
  <h1>Trigger Report</h1>
  <p class="muted">${escapeHtml(data.skill_name)} · ${data.run_at}</p>
  <section class="summary-card">
    <h2>Summary</h2>
    <div class="summary-row">
      <span class="result-badge ${overallClass}">${passRatePercent}%</span>
      <span class="overall ${overallClass}">${data.passed} / ${data.total} queries passed</span>
    </div>
    <div class="summary-stats">10 runs per query</div>
  </section>
  <h2>Results</h2>
  <details class="trigger-details" ${allPassed ? "" : "open"}>
    <summary>${allPassed ? "All passed — click to view all queries" : `${data.failed} failed — view details`}</summary>
    <div class="details-body">${tableHtml}</div>
  </details>
</body>
</html>`;
}
