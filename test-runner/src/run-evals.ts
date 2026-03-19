import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { gradeResponse, runEval, type RunEvalOptions } from "./ai.js";
import type {
  EvalRunResult,
  EvalSingleRun,
  EvalsFile,
  ReportData,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** test-runner dir (parent of src) */
const RUNNER_ROOT = join(__dirname, "..");
/** Repo root (parent of test-runner) */
const REPO_ROOT = join(__dirname, "..", "..");

const RUNS_PER_EVAL = 3;

export function loadEvalsFile(skillName: string): EvalsFile {
  const path = join(RUNNER_ROOT, "tests", `${skillName}.evals.json`);
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content) as EvalsFile;
}

export function loadSkillContent(skillName: string): string {
  const path = join(REPO_ROOT, "skills", skillName, "SKILL.md");
  return readFileSync(path, "utf-8");
}

/** List all files in the skill directory (relative paths). Used so the AI knows what it can read. */
export function listSkillFiles(skillName: string): string[] {
  const skillDir = join(REPO_ROOT, "skills", skillName);
  const out: string[] = [];
  function walk(dir: string, prefix: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = prefix ? `${prefix}/${e.name}` : e.name;
      if (e.isDirectory()) walk(join(dir, e.name), rel);
      else out.push(rel);
    }
  }
  walk(skillDir, "");
  return out.sort();
}

async function runOneEval(
  evalCase: EvalsFile["evals"][number],
  skillContent: string,
  evalOptions: RunEvalOptions
): Promise<EvalRunResult> {
  const runPromises = Array.from({ length: RUNS_PER_EVAL }, async () => {
    const {
      text: response,
      duration_ms,
      usage,
    } = await runEval(skillContent, evalCase.prompt, evalOptions);
    const { assertion_results } = await gradeResponse(
      response,
      evalCase.assertions
    );
    return {
      response,
      assertion_results,
      duration_ms,
      usage: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
    };
  });

  const runs = await Promise.all(runPromises);

  const nAssertions = evalCase.assertions.length;
  const assertionScores = Array.from(
    { length: nAssertions },
    (_, i) => runs.filter((r) => r.assertion_results[i]?.passed).length
  );
  const runsPassed = runs.filter((run) =>
    run.assertion_results.every((a) => a.passed)
  ).length;
  const assertion_results = runs[0].assertion_results.map((a, i) => ({
    text: a.text,
    passed: assertionScores[i] >= Math.ceil(RUNS_PER_EVAL / 2),
    evidence: a.evidence,
    score: `${assertionScores[i]}/${RUNS_PER_EVAL}`,
  }));
  const totalDurationEval = runs.reduce((s, r) => s + r.duration_ms, 0);
  const totalTokens = runs.reduce((s, r) => s + r.usage.totalTokens, 0);
  const totalPrompt = runs.reduce((s, r) => s + r.usage.promptTokens, 0);
  const totalCompletion = runs.reduce(
    (s, r) => s + r.usage.completionTokens,
    0
  );

  const runSummaries: EvalSingleRun[] = runs.map((run) => ({
    response: run.response,
    assertion_results: run.assertion_results,
    duration_ms: run.duration_ms,
  }));

  return {
    id: evalCase.id,
    prompt: evalCase.prompt,
    expected_output: evalCase.expected_output,
    assertions: evalCase.assertions,
    response: runs[0].response,
    assertion_results,
    runs: runSummaries,
    summary: {
      passed: runsPassed,
      failed: RUNS_PER_EVAL - runsPassed,
      total: RUNS_PER_EVAL,
      pass_rate: runsPassed / RUNS_PER_EVAL,
      runsPassed,
      runsTotal: RUNS_PER_EVAL,
    },
    duration_ms: totalDurationEval,
    tokens: {
      prompt: totalPrompt,
      completion: totalCompletion,
      total: totalTokens,
    },
  };
}

export async function runAllEvals(skillName: string): Promise<ReportData> {
  const evalsFile = loadEvalsFile(skillName);
  const skillContent = loadSkillContent(skillName);
  const fileListing = listSkillFiles(skillName);
  const evalOptions = { skillName, repoRoot: REPO_ROOT, fileListing };

  console.log(
    `  Running ${evalsFile.evals.length} evals in parallel (${RUNS_PER_EVAL} runs each)...`
  );
  const results = await Promise.all(
    evalsFile.evals.map((evalCase) =>
      runOneEval(evalCase, skillContent, evalOptions)
    )
  );
  results.sort((a, b) => a.id - b.id);

  const totalDuration = results.reduce((s, r) => s + r.duration_ms, 0);
  const totalRuns = results.length * RUNS_PER_EVAL;
  const totalRunsPassed = results.reduce(
    (s, r) => s + (r.summary.runsPassed ?? r.summary.passed),
    0
  );

  return {
    skill_name: skillName,
    run_at: new Date().toISOString(),
    total_evals: results.length,
    total_passed: totalRunsPassed,
    total_failed: totalRuns - totalRunsPassed,
    pass_rate: totalRuns > 0 ? totalRunsPassed / totalRuns : 0,
    total_duration_ms: totalDuration,
    results,
  };
}
