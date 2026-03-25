import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
  );
  const data = await res.json();
  console.log(data);
}

// listModels();

export const generateAIReviewer = async (text: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert study assistant.

Analyze the material below and generate a structured reviewer.

CONTENT:
${text}

OUTPUT:
1. Key Concepts (bullet points)
2. Detailed Summary (easy to understand)
3. Quiz (3 questions with answers)
4. Important Terms (with definitions)
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const aiMessage = response.text();

  if (!aiMessage) {
    throw new Error("Gemini did not return any content");
  }

  return aiMessage;
};
