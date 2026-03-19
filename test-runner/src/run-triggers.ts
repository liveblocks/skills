import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { runTriggerCheck } from "./ai.js";
import { getSkillMeta } from "./skill-meta.js";
import type {
  TriggerQuery,
  TriggerReportData,
  TriggerResult,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUNNER_ROOT = join(__dirname, "..");

// How many times each trigger eval should run
const RUNS_PER_QUERY = 10;

// Percentage of runs that should pass for a success
const TRIGGER_PASS_THRESHOLD = 0.8;

export function loadTriggerQueries(skillName: string): TriggerQuery[] {
  const path = join(RUNNER_ROOT, "tests", `${skillName}.trigger-evals.json`);
  const content = readFileSync(path, "utf-8");
  const data = JSON.parse(content);
  return Array.isArray(data) ? data : (data.queries ?? []);
}

async function runOneTriggerQuery(
  q: TriggerQuery,
  name: string,
  description: string
): Promise<TriggerResult> {
  const runPromises = Array.from({ length: RUNS_PER_QUERY }, () =>
    runTriggerCheck(name, description, q.query)
  );
  const runResults = await Promise.all(runPromises);
  const runsTriggered = runResults.filter((r) => r.use_skill).length;
  const lastRaw = runResults[runResults.length - 1]?.raw ?? "";
  const minCorrectRuns = Math.ceil(RUNS_PER_QUERY * TRIGGER_PASS_THRESHOLD);
  const runsCorrect = q.should_trigger
    ? runsTriggered
    : RUNS_PER_QUERY - runsTriggered;
  const passed = runsCorrect >= minCorrectRuns;
  const majority = Math.ceil(RUNS_PER_QUERY / 2);
  return {
    query: q.query,
    should_trigger: q.should_trigger,
    triggered: runsTriggered >= majority,
    passed,
    runsTriggered,
    runsTotal: RUNS_PER_QUERY,
    raw_response: lastRaw,
  };
}

export async function runAllTriggerQueries(
  skillName: string
): Promise<TriggerReportData> {
  const queries = loadTriggerQueries(skillName);
  const { name, description } = getSkillMeta(skillName);

  console.log(
    `  Running ${queries.length} trigger queries in parallel (${RUNS_PER_QUERY} runs each)...`
  );
  const results = await Promise.all(
    queries.map((q) => runOneTriggerQuery(q, name, description))
  );

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  return {
    skill_name: skillName,
    run_at: new Date().toISOString(),
    total,
    passed,
    failed: total - passed,
    pass_rate: total > 0 ? passed / total : 0,
    results,
  };
}
