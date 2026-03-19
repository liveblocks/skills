import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";

function getModel(): LanguageModel {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-20250514");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o");
  }
  throw new Error(
    "Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment (or .env file)"
  );
}

export async function runEval(skillContent: string, userPrompt: string): Promise<{
  text: string;
  duration_ms: number;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
}> {
  const model = getModel();
  const start = Date.now();
  const result = await generateText({
    model,
    system: `You are an expert assistant. Use the following skill document to answer the user's question. Apply it precisely and concisely.\n\n---\n\n${skillContent}`,
    prompt: userPrompt,
    maxOutputTokens: 2048,
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
): Promise<{ assertion_results: Array<{ text: string; passed: boolean; evidence: string }> }> {
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
      assertion_results: Array<{ text: string; passed: boolean; evidence: string }>;
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

  const result = await generateText({
    model,
    system,
    prompt: userQuery,
    maxOutputTokens: 32,
  });

  const raw = result.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : raw;
  try {
    const parsed = JSON.parse(jsonStr) as { use_skill?: boolean };
    return {
      use_skill: Boolean(parsed.use_skill),
      raw,
    };
  } catch {
    const useSkill = /true|yes|1/i.test(raw);
    return { use_skill: useSkill, raw };
  }
}
