import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function parseTransactionText(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following messy financial transaction text: "${text}".
    Extract: amount, type (income or expense), category (normalize to common categories), and a clean description.
    If multiple transactions are present, just parse the first or most prominent one.
    Categories should handle typos (e.g. foood -> food, petorl -> fuel).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER, description: "The numeric amount" },
          type: { type: Type.STRING, enum: ["income", "expense"], description: "Whether it is income or expense" },
          category: { type: Type.STRING, description: "Normalized category name" },
          description: { type: Type.STRING, description: "Clean description" },
          notes: { type: Type.STRING, description: "Additional notes or context" },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1" }
        },
        required: ["amount", "type", "category"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON", e);
    return null;
  }
}

export async function suggestCategory(rawInput: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Normalize this financial category or description into a clean category name: "${rawInput}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING },
                    confidence: { type: Type.NUMBER }
                },
                required: ["category"]
            }
        }
    });

    try {
        return JSON.parse(response.text);
    } catch (e) {
        return { category: 'other', confidence: 0 };
    }
}
