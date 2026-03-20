import { config } from "dotenv";
// Load .env then .env.local (local overrides)
config();
config({ path: ".env.local" });
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import open from "open";
import { runAllEvals } from "./run-evals.js";
import { runAllTriggerQueries } from "./run-triggers.js";
import { generateHtmlReport, generateTriggerReport } from "./report.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", ".results");
const REPORT_PATH = join(OUTPUT_DIR, "report.html");
const TRIGGER_REPORT_PATH = join(OUTPUT_DIR, "report-trigger.html");

function getSkillName(): string {
  const argv = process.argv.slice(2);
  const idx = argv.indexOf("--skill");
  if (idx !== -1 && argv[idx + 1]) return argv[idx + 1];
  return "yjs-best-practices";
}

function hasTriggerOnlyFlag(): boolean {
  return process.argv.includes("--trigger");
}

function hasEvalsOnlyFlag(): boolean {
  return process.argv.includes("--evals-only");
}

async function main() {
  const skillName = getSkillName();
  const triggerOnly = hasTriggerOnlyFlag();
  const evalsOnly = hasEvalsOnlyFlag();
  const runEvals = !triggerOnly;
  const runTriggers = !evalsOnly;

  mkdirSync(OUTPUT_DIR, { recursive: true });

  if (runEvals) {
    console.log(`Running evals for skill: ${skillName}\n`);
    const data = await runAllEvals(skillName);
    const html = generateHtmlReport(data);
    writeFileSync(REPORT_PATH, html, "utf-8");
    console.log(`\nEval report written to ${REPORT_PATH}`);
    await open(REPORT_PATH);
  }

  if (runTriggers) {
    console.log(`\nRunning trigger queries for skill: ${skillName}\n`);
    const data = await runAllTriggerQueries(skillName);
    const html = generateTriggerReport(data);
    writeFileSync(TRIGGER_REPORT_PATH, html, "utf-8");
    console.log(`\nTrigger report written to ${TRIGGER_REPORT_PATH}`);
    await open(TRIGGER_REPORT_PATH);
  }

  if (runEvals && runTriggers) {
    console.log("\nBoth reports opened in browser.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
