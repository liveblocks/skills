import { readFileSync } from "fs";
import { join, normalize } from "path";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool, type LanguageModel } from "ai";
import { z } from "zod";

function getModel(): LanguageModel {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-20250514");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-5");
  }
  throw new Error(
    "Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment (or .env file)"
  );
}

export type RunEvalOptions = {
  skillName: string;
  repoRoot: string;
  /** Relative paths of files in the skill dir so the AI knows what it can read. */
  fileListing: string[];
};

function createReadFileTool(skillName: string, repoRoot: string) {
  const skillRoot = join(repoRoot, "skills", skillName);
  return tool({
    description:
      "Read a file from this skill. Path is relative to the skill folder (e.g. 'rules/auth-endpoint-callback.md'). Use this to open individual rule or doc files when you need details.",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          "File path relative to the skill folder, e.g. rules/foo.md or SKILL.md"
        ),
    }),
    execute: async ({ path: relativePath }) => {
      const resolved = normalize(join(skillRoot, relativePath));
      if (!resolved.startsWith(skillRoot)) {
        return { error: "Path must be inside the skill folder." };
      }
      try {
        const content = readFileSync(resolved, "utf-8");
        return { content };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { error: `Could not read file: ${message}` };
      }
    },
  });
}

export async function runEval(
  skillContent: string,
  userPrompt: string,
  options?: RunEvalOptions
): Promise<{
  text: string;
  duration_ms: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}> {
  const model = getModel();
  const start = Date.now();

  const systemBase = `You are an expert assistant. Use the following skill document to answer the user's question. Apply it precisely and concisely.`;
  const fileInstruction = options
    ? `\n\nYou may read further files from this skill by calling the read_file tool with a path relative to the skill folder. You can only read files that exist; here are the files in this skill directory:\n\n${options.fileListing.map((f) => `- ${f}`).join("\n")}\n\nUse one of these paths when you need the full content of a rule or doc.`
    : "";
  const system = `${systemBase}${fileInstruction}\n\n---\n\n${skillContent}`;

  const tools = options
    ? { read_file: createReadFileTool(options.skillName, options.repoRoot) }
    : undefined;

  const result = await generateText({
    model,
    system,
    prompt: userPrompt,
    maxOutputTokens: 2048,
    ...(tools && {
      tools,
      stopWhen: stepCountIs(5),
    }),
  });

  const duration_ms = Date.now() - start;
  const u = result.usage;
  const promptTokens = u?.inputTokens ?? 0;
  const completionTokens = u?.outputTokens ?? 0;
  const usage = {
    promptTokens,
    completionTokens,
    totalTokens: u?.totalTokens ?? promptTokens + completionTokens,
  };
  return {
    text: result.text,
    duration_ms,
    usage,
  };
}

export async function gradeResponse(
  response: string,
  assertions: string[]
): Promise<{
  assertion_results: Array<{ text: string; passed: boolean; evidence: string }>;
}> {
  const model = getModel();
  const prompt = `You are grading an assistant's response against a list of assertions.

**Assistant's response:**
${response}

**Assertions to check (each must be PASS or FAIL with brief evidence):**
${assertions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Respond with a JSON object only, no markdown or extra text. Use this exact shape:
{"assertion_results": [{"text": "<assertion>", "passed": true|false, "evidence": "<one sentence>"}, ...]}

Grade strictly: PASS only if the response clearly satisfies the assertion; FAIL with evidence if it does not.`;

  const result = await generateText({
    model,
    prompt,
    maxOutputTokens: 1024,
  });

  const raw = result.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : raw;
  try {
    const parsed = JSON.parse(jsonStr) as {
      assertion_results: Array<{
        text: string;
        passed: boolean;
        evidence: string;
      }>;
    };
    if (!Array.isArray(parsed.assertion_results)) {
      throw new Error("Missing assertion_results array");
    }
    return parsed;
  } catch (e) {
    return {
      assertion_results: assertions.map((text) => ({
        text,
        passed: false,
        evidence: `Grading failed: ${e instanceof Error ? e.message : String(e)}. Raw: ${raw.slice(0, 200)}`,
      })),
    };
  }
}

/**
 * Ask the model whether it would use the given skill to answer the user message.
 * Simulates the agent's decision using only skill name + description (no full skill content).
 */
export async function runTriggerCheck(
  skillName: string,
  skillDescription: string,
  userQuery: string
): Promise<{ use_skill: boolean; raw: string }> {
  const model = getModel();
  const system = `You are an agent that decides which skills to load. You have access to this skill:

Name: ${skillName}
Description: ${skillDescription}

The user will send a message. Reply with ONLY a JSON object: {"use_skill": true} if you would load and use this skill to answer their message, or {"use_skill": false} if you would not. Do not answer the message yourself. No other text or markdown.`;

  let result: Awaited<ReturnType<typeof generateText>>;
  try {
    result = await generateText({
      model,
      system,
      prompt: userQuery,
      maxOutputTokens: 1024,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      use_skill: false,
      raw: `(API error: ${msg})`,
    };
  }

  const raw = (result.text ?? "").trim();
  const finishReason =
    result.finishReason ?? result.rawFinishReason ?? "unknown";
  const displayRaw = raw
    ? raw
    : `(empty response; finishReason: ${finishReason})`;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : raw;
  try {
    const parsed = JSON.parse(jsonStr) as { use_skill?: boolean };
    return {
      use_skill: Boolean(parsed.use_skill),
      raw: displayRaw,
    };
  } catch {
    const useSkill = raw ? /true|yes|1/i.test(raw) : false;
    return { use_skill: useSkill, raw: displayRaw };
  }
}
