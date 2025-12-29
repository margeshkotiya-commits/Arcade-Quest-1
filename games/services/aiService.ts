import { GoogleGenerativeAI } from "@google/generative-ai";

// Global variable to hold the model instance (starts empty)
let aiModel: any = null;

/**
 * Safely initializes the AI only when needed.
 * This prevents the "White Screen" crash on page load.
 */
const getAIModel = () => {
  // 1. If we already started it, return it.
  if (aiModel) return aiModel;

  // 2. Check for key safely
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY || API_KEY.length === 0) {
    console.warn("⚠️ AI Skipped: Missing API Key.");
    return null; // Return null safely
  }

  // 3. Initialize
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    aiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    return aiModel;
  } catch (error) {
    console.error("⚠️ AI Init Error:", error);
    return null;
  }
};

// === Helper Functions ===

export const generateAiFeedback = async (score: number, total: number, subject: string): Promise<string> => {
  const model = getAIModel(); // <--- Only tries to start AI here!

  if (!model) {
    return `Great job completing the ${subject} mission! You scored ${score}/${total}.`;
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
  const model = getAIModel(); // <--- Only tries to start AI here!

  if (!model) {
    console.warn("Cannot generate questions: AI not active.");
    return []; 
  }

  try {
    const prompt = `Generate 5 multiple choice questions for Grade ${grade} ${subject}. Return ONLY valid JSON array.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    return [];
  }
};
