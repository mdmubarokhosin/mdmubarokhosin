export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

/* ═══════════════ Types ═══════════════ */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface SiteSettings {
  aiChatbotEnabled: boolean;
  aiChatbotApiKey: string;
  aiChatbotBaseUrl: string;
  aiChatbotModel: string;
  aiChatbotSystemPrompt: string;
}

const defaultSettings: SiteSettings = {
  aiChatbotEnabled: true,
  aiChatbotApiKey: "",
  aiChatbotBaseUrl: "https://openrouter.ai/api/v1",
  aiChatbotModel: "google/gemini-2.5-flash-preview-05-20",
  aiChatbotSystemPrompt:
    "You are a helpful assistant for MD MUBAROK HOSIN's portfolio website. Answer questions about his skills, projects, and services politely in Bengali or English.",
};

/* ═══════════════ Firebase Settings ═══════════════ */

async function getSettings(): Promise<SiteSettings> {
  try {
    const settingsRef = ref(db, "settings");
    const snapshot = await get(settingsRef);
    if (snapshot.exists()) {
      const d = snapshot.val();
      return {
        aiChatbotEnabled: d.aiChatbotEnabled ?? defaultSettings.aiChatbotEnabled,
        aiChatbotApiKey: d.aiChatbotApiKey ?? defaultSettings.aiChatbotApiKey,
        aiChatbotBaseUrl: d.aiChatbotBaseUrl ?? defaultSettings.aiChatbotBaseUrl,
        aiChatbotModel: d.aiChatbotModel ?? defaultSettings.aiChatbotModel,
        aiChatbotSystemPrompt: d.aiChatbotSystemPrompt ?? defaultSettings.aiChatbotSystemPrompt,
      };
    }
  } catch (error) {
    console.error("[Chatbot] Firebase settings read error:", error);
  }
  return defaultSettings;
}

/* ═══════════════ Provider Detection ═══════════════ */

type Provider = "gemini_native" | "openai_compatible";

function detectProvider(baseUrl: string, model: string): Provider {
  const url = baseUrl.toLowerCase();

  // Google Gemini native API (NOT OpenAI-compatible path)
  if (
    (url.includes("generativelanguage.googleapis.com") ||
      url.includes("aiplatform.googleapis.com")) &&
    !url.includes("/openai")
  ) {
    return "gemini_native";
  }

  // Everything else uses OpenAI-compatible format
  // This includes: OpenRouter, Google OpenAI-compatible, Groq, OpenAI, etc.
  return "openai_compatible";
}

/* ═══════════════ Google Gemini Native API ═══════════════ */

interface GeminiContent {
  role: string;
  parts: Array<{ text: string }>;
}

function buildGeminiRequest(
  messages: ChatMessage[],
  model: string,
  systemPrompt: string
): { url: string; body: string } {
  const contents: GeminiContent[] = [];

  for (const msg of messages) {
    if (msg.role === "system") continue;
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  if (contents.length > 0 && contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  const body = {
    contents,
    systemInstruction: systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  return { url, body: JSON.stringify(body) };
}

function parseGeminiResponse(data: Record<string, unknown>): string | null {
  try {
    const candidates = data.candidates as Array<{
      content?: { parts?: Array<{ text?: string }> };
    }> | undefined;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        return parts[0]?.text || null;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/* ═══════════════ OpenAI-Compatible API ═══════════════ */

function buildOpenAIUrl(baseUrl: string): string {
  let url = baseUrl.trim();
  if (url.endsWith("/")) url = url.slice(0, -1);
  if (url.endsWith("/chat/completions")) return url;
  return `${url}/chat/completions`;
}

function buildOpenAIHeaders(baseUrl: string, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const url = baseUrl.toLowerCase();

  // OpenRouter requires extra headers
  if (url.includes("openrouter.ai")) {
    headers["HTTP-Referer"] = "https://md-mubarok-hossain.firebaseapp.com";
    headers["X-Title"] = "MD MUBAROK HOSIN Portfolio";
  }

  // Google OpenAI-compatible endpoint
  if (url.includes("generativelanguage.googleapis.com") && url.includes("/openai")) {
    // Already handled by Bearer token in Authorization header
  }

  return headers;
}

function parseOpenAIResponse(data: Record<string, unknown>): string | null {
  try {
    const choices = data.choices as Array<{
      message?: { content?: string };
    }> | undefined;
    if (choices && choices.length > 0) {
      return choices[0]?.message?.content || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/* ═══════════════ Helpful Error Messages ═══════════════ */

function getHelpfulError(status: number, errorMsg: string, baseUrl: string, model: string): string {
  const url = baseUrl.toLowerCase();

  // Location restriction from Google
  if (errorMsg.toLowerCase().includes("location") && errorMsg.toLowerCase().includes("not supported")) {
    return `Your region is not supported by Google AI Studio direct API.\n\nSolution: Use OpenRouter instead:\n1. Go to openrouter.ai and create a free account\n2. Get an API key from openrouter.ai/keys\n3. In Admin Panel > Settings, set:\n   - Base URL: https://openrouter.ai/api/v1\n   - API Key: (your OpenRouter key)\n   - Model: google/gemini-2.5-flash-preview-05-20\n\nOpenRouter works from any country and supports all Gemini models!`;
  }

  if (status === 400) {
    if (url.includes("openrouter.ai")) {
      return `Bad Request (400): ${errorMsg}\n\nCheck:\n- Model name format: google/gemini-2.5-flash-preview-05-20\n- API key is valid for OpenRouter\n- You have credits on your OpenRouter account`;
    }
    return `Bad Request (400): ${errorMsg}\n\nCheck:\n- Model name is correct\n- Base URL is correct\n- API Key is valid`;
  }

  if (status === 401) {
    return `Authentication failed (401). Your API key is invalid or expired. Please check it in Admin Panel > Settings.`;
  }

  if (status === 403) {
    return `Access denied (403): ${errorMsg}\n\nYour API key may not have access to this model, or your region is restricted.\n\nTip: Use OpenRouter (openrouter.ai) which works from all countries.`;
  }

  if (status === 404) {
    return `Model "${model}" not found (404).\n\nAvailable models depend on your provider:\n- OpenRouter: google/gemini-2.5-flash-preview-05-20\n- Google AI: gemini-2.5-flash\n- OpenAI: gpt-4o-mini\n- Groq: llama-3.1-8b-instant`;
  }

  if (status === 429) {
    return `Rate limited (429). Too many requests. Please wait a moment and try again.`;
  }

  if (status === 402) {
    return `Payment required (402). Your API account has no credits remaining. Please top up at your provider's dashboard.`;
  }

  return `API error (${status}): ${errorMsg}`;
}

/* ═══════════════ Main POST Handler ═══════════════ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body as {
      message?: string;
      history?: Array<{ from: string; text: string }>;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please provide a message." },
        { status: 400 }
      );
    }

    // Read settings from Firebase
    const settings = await getSettings();

    console.log("[Chatbot] Settings:", {
      enabled: settings.aiChatbotEnabled,
      hasKey: !!settings.aiChatbotApiKey,
      baseUrl: settings.aiChatbotBaseUrl,
      model: settings.aiChatbotModel,
    });

    if (!settings.aiChatbotEnabled) {
      return NextResponse.json({
        reply: "AI Chatbot is currently disabled. Enable it from Admin Panel > Settings.",
      });
    }

    if (!settings.aiChatbotApiKey) {
      return NextResponse.json({
        reply: "AI Chatbot API Key is missing. Please add it in Admin Panel > Settings > AI Chatbot.",
      });
    }

    if (!settings.aiChatbotModel) {
      return NextResponse.json({
        reply: "AI Chatbot Model name is missing. Please add it in Admin Panel > Settings > AI Chatbot.",
      });
    }

    // Build messages array
    const messages: ChatMessage[] = [];
    if (settings.aiChatbotSystemPrompt) {
      messages.push({ role: "system", content: settings.aiChatbotSystemPrompt });
    }
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-20).filter(
        (msg) => msg && typeof msg.text === "string" && msg.text.trim()
      );
      for (const msg of recent) {
        messages.push({
          role: msg.from === "user" ? "user" : "assistant",
          content: msg.text,
        });
      }
    }
    messages.push({ role: "user", content: message });

    // Detect provider and make API call
    const baseUrl = settings.aiChatbotBaseUrl || "https://openrouter.ai/api/v1";
    const provider = detectProvider(baseUrl, settings.aiChatbotModel);

    console.log("[Chatbot] Detected provider:", provider, "baseUrl:", baseUrl, "model:", settings.aiChatbotModel);

    let apiResponse: Response;
    let replyText: string | null = null;

    if (provider === "gemini_native") {
      /* ─── Google Gemini Native API ─── */
      const { url, body } = buildGeminiRequest(
        messages,
        settings.aiChatbotModel,
        settings.aiChatbotSystemPrompt
      );

      const fullUrl = `${url}?key=${settings.aiChatbotApiKey}`;

      console.log("[Chatbot] Gemini native request:", url, "model:", settings.aiChatbotModel);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        apiResponse = await fetch(fullUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: controller.signal,
        });
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        const msg = fetchError instanceof Error ? fetchError.message : "Unknown";
        if (msg.includes("abort")) {
          return NextResponse.json({ reply: "AI service timed out. Please try again." });
        }
        return NextResponse.json({ reply: `Connection error: ${msg}` });
      }

      clearTimeout(timeoutId);

      const responseText = await apiResponse.text();

      if (!apiResponse.ok) {
        console.error("[Chatbot] Gemini error:", apiResponse.status, responseText);
        let errorMsg = `HTTP ${apiResponse.status}`;
        try {
          const e = JSON.parse(responseText);
          errorMsg = e?.error?.message || e?.error?.status || e?.message || errorMsg;
        } catch { /* keep default */ }

        return NextResponse.json({
          reply: getHelpfulError(apiResponse.status, errorMsg, baseUrl, settings.aiChatbotModel),
        });
      }

      try {
        const data = JSON.parse(responseText);
        replyText = parseGeminiResponse(data);
      } catch {
        console.error("[Chatbot] Invalid Gemini response:", responseText.substring(0, 200));
      }
    } else {
      /* ─── OpenAI-Compatible API (OpenRouter, Google OpenAI, Groq, OpenAI, etc.) ─── */
      const apiUrl = buildOpenAIUrl(baseUrl);
      const headers = buildOpenAIHeaders(baseUrl, settings.aiChatbotApiKey);
      const requestBody = {
        model: settings.aiChatbotModel,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      };

      console.log("[Chatbot] OpenAI-compatible request:", apiUrl, "model:", requestBody.model);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        apiResponse = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        const msg = fetchError instanceof Error ? fetchError.message : "Unknown";
        if (msg.includes("abort")) {
          return NextResponse.json({ reply: "AI service timed out. Please try again." });
        }
        return NextResponse.json({ reply: `Connection error: ${msg}` });
      }

      clearTimeout(timeoutId);

      const responseText = await apiResponse.text();

      if (!apiResponse.ok) {
        console.error("[Chatbot] API error:", apiResponse.status, responseText);
        let errorMsg = `HTTP ${apiResponse.status}`;
        try {
          const e = JSON.parse(responseText);
          errorMsg = e?.error?.message || e?.message || e?.detail || errorMsg;
        } catch { /* keep default */ }

        return NextResponse.json({
          reply: getHelpfulError(apiResponse.status, errorMsg, baseUrl, settings.aiChatbotModel),
        });
      }

      try {
        const data = JSON.parse(responseText);
        replyText = parseOpenAIResponse(data);
      } catch {
        console.error("[Chatbot] Invalid response:", responseText.substring(0, 200));
      }
    }

    if (!replyText) {
      return NextResponse.json({ reply: "AI returned an empty response. Please try again." });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("[Chatbot] Unexpected error:", error);
    return NextResponse.json({ reply: "Something went wrong. Please try again later." });
  }
}
