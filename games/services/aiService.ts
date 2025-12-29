// ==========================================
// 🚫 AI DISABLED MODE
// This file replaces the real AI with static logic.
// No API Key is required.
// ==========================================

/**
 * Generates feedback based on the score using simple math logic
 * instead of calling an external AI.
 */
export const generateAiFeedback = async (score: number, total: number, subject: string): Promise<string> => {
  // Calculate percentage
  // Avoid division by zero
  const percentage = total > 0 ? (score / total) * 100 : 0;

  // Simulate a slight delay to make it feel like "processing"
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return specific messages based on performance
  if (percentage >= 90) {
    return `Incredible! You are a ${subject} Master! 🌟 Keep up the amazing work!`;
  }
  if (percentage >= 75) {
    return `Great job! You have strong skills in ${subject}. 🚀 A little more practice and you'll be perfect!`;
  }
  if (percentage >= 50) {
    return `Good effort! You're on the right track with ${subject}. 👍 Keep practicing!`;
  }
  if (percentage > 0) {
    return `Nice try! Don't give up. Review your mistakes and try ${subject} again! 💪`;
  }
  
  return `Mission Failed, but that's okay! Every mistake is a lesson. Try again!`;
};

/**
 * Placeholder for Question Generation.
 * Since AI is disabled, this returns an empty array.
 * The App will fall back to using your QuestionBank or JSON upload.
 */
export const generateQuestionsFromAI = async (grade: string, subject: string): Promise<any[]> => {
  console.log("AI Generation is disabled. Using default Question Bank.");
  return [];
};
