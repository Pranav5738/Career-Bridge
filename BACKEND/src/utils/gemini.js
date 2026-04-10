import { env } from "../config/env.js";

const extractGeminiText = (responseJson) => {
    const parts = responseJson?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) {
        return "";
    }

    return parts
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("\n")
        .trim();
};

const parseJsonPayload = (text) => {
    if (!text) {
        throw new Error("Empty AI response");
    }

    try {
        return JSON.parse(text);
    } catch {
        const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
        if (fenced?.[1]) {
            return JSON.parse(fenced[1]);
        }

        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            return JSON.parse(text.slice(firstBrace, lastBrace + 1));
        }

        throw new Error("Unable to parse AI response JSON");
    }
};

export const generateGeminiJson = async ({
    model,
    systemPrompt,
    userPrompt,
    timeoutMs = 8000,
}) => {
    const key = String(env.geminiApiKey || "").trim();
    if (!key || key.includes("replace_me")) {
        const err = new Error("Gemini API key is not configured on server");
        err.status = 500;
        throw err;
    }

    const selectedModel = model || env.geminiModel || "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: [
                                    systemPrompt,
                                    "",
                                    userPrompt,
                                ].join("\n")
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json"
                }
            }),
            signal: controller.signal
        });

        const raw = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = raw?.error?.message || "Gemini request failed";
            const err = new Error(message);
            err.status = response.status;
            throw err;
        }

        return parseJsonPayload(extractGeminiText(raw));
    } catch (error) {
        if (error?.name === "AbortError") {
            const err = new Error("Gemini request timed out");
            err.status = 504;
            throw err;
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
};
