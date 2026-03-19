import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");

/**
 * Extract skill name and description from SKILL.md frontmatter.
 * Used for trigger tests (agents only see name + description when deciding to load a skill).
 */
export function getSkillMeta(skillName: string): { name: string; description: string } {
  const path = join(REPO_ROOT, "skills", skillName, "SKILL.md");
  const raw = readFileSync(path, "utf-8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`No frontmatter in ${path}`);
  }
  const front = match[1];
  const nameMatch = front.match(/name:\s*["']([^"']*)["']/);
  const name = nameMatch ? nameMatch[1].trim() : skillName;
  // Description can be multiline; value often after description:\n  "
  const descMatch = front.match(/description:\s*\n?\s*["']([\s\S]*?)["']\s*\n/m);
  const description = descMatch ? descMatch[1].replace(/\n\s*/g, " ").trim() : "";
  return { name, description };
}
