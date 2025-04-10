// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAnPrpumDs-PjZKRN2gqMhxMvtZVoUB28g"; // 👈 keep this secret in .env later

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateGeminiResponse(message) {
  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Oops! Couldn't generate a response right now.";
  }
}
