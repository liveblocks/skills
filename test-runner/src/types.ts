export interface EvalsFile {
  skill_name: string;
  evals: Array<{
    id: number;
    prompt: string;
    expected_output: string;
    files?: string[];
    assertions: string[];
  }>;
}

export interface AssertionResult {
  text: string;
  passed: boolean;
  evidence: string;
  /** When running multiple times, e.g. "2/3" */
  score?: string;
}

/** Single run output (one of N runs per eval). */
export interface EvalSingleRun {
  response: string;
  assertion_results: AssertionResult[];
  duration_ms: number;
}

export interface EvalRunResult {
  id: number;
  prompt: string;
  expected_output: string;
  assertions: string[];
  /** First run's response (for backward compat). */
  response: string;
  assertion_results: AssertionResult[];
  /** All runs when running each eval multiple times. */
  runs?: EvalSingleRun[];
  summary: {
    passed: number;
    failed: number;
    total: number;
    pass_rate: number;
    runsPassed?: number;
    runsTotal?: number;
  };
  duration_ms: number;
  tokens?: { prompt: number; completion: number; total: number };
}

export interface ReportData {
  skill_name: string;
  run_at: string;
  total_evals: number;
  total_passed: number;
  total_failed: number;
  pass_rate: number;
  total_duration_ms: number;
  results: EvalRunResult[];
}

export interface TriggerQuery {
  query: string;
  should_trigger: boolean;
}

export interface TriggerResult {
  query: string;
  should_trigger: boolean;
  /** Single run result (for backward compat); when using multiple runs, use runsTriggered. */
  triggered: boolean;
  passed: boolean;
  /** Number of runs where the skill was triggered (e.g. 7 of 10). */
  runsTriggered?: number;
  runsTotal?: number;
  raw_response?: string;
}

export interface TriggerReportData {
  skill_name: string;
  run_at: string;
  total: number;
  passed: number;
  failed: number;
  pass_rate: number;
  results: TriggerResult[];
}
