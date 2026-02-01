
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateHolidayGreeting = async (name: string = "Guest") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, extremely luxurious and poetic Christmas greeting for ${name}. 
      The style should be 'Arix Signature' - sophisticated, high-end, and cinematic. 
      Mention themes of emerald, gold, and eternal elegance. Keep it under 40 words.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });
    return response.text || "May your season be draped in emerald and bathed in eternal gold.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Wishing you a season of unparalleled brilliance and signature elegance.";
  }
};
