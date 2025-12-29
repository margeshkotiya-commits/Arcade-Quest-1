import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Get the API Key safely
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// 2. Initialize variables (but don't start AI yet)
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// 3. Try to connect ONLY if the key exists
if (API_KEY && API_KEY.length > 0) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
  } catch (error) {
    console.error("AI Service Initialization Failed:", error);
  }
} else {
  // Log a warning so you know why AI isn't working, but DON'T CRASH
  console.warn("⚠️ AI Features Disabled: VITE_GEMINI_API_KEY is missing in Environment Variables.");
}

// === Helper Functions ===

export const generateAiFeedback = async (score: number, total: number, subject: string): Promise<string> => {
  // SAFETY CHECK: If AI didn't load, return a default message
  if (!model) {
    return `Great job completing the ${subject} mission! You scored ${score}/${total}. (AI Feedback unavailable)`;
  }

  try {
    const prompt = `Write a short, encouraging message for a student who got ${score} out of ${total} on a ${subject} test. Keep it under 2 sentences. Use emojis.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    return `Mission Complete! You scored ${score}/${total}. Keep practicing!`;
  }
};

export const generateQuestionsFromAI = async (grade: string, subject: string): Promise<any[]> => {
  // SAFETY CHECK: If AI didn't load, return empty array
  if (!model) {
    console.warn("Cannot generate questions: No API Key.");
    return []; 
  }

  try {
    const prompt = `Generate 5 multiple choice questions for Grade ${grade} ${subject}. Return ONLY valid JSON array.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Basic cleanup to ensure JSON is valid
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    return [];
  }
};
