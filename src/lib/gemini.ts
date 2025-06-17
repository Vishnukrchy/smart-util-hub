import { GoogleGenerativeAI } from '@google/generative-ai';

export async function geminiChatCompletion(prompt: string, system?: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const contents = [
    ...(system ? [{ role: "user", parts: [{ text: system }] }] : []),
    { role: "user", parts: [{ text: prompt }] }
  ];

  const result = await model.generateContent({ contents });
  return result.response.text() || "No response from Gemini.";
} 