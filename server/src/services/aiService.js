import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});

export const callGeminiAPI = async (code) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `you are helpful ai assistance that reviews code and give feedback.
    here is the code: ${code}
    Please provide a detailed review of the code,including any errors or issues, and suggestions for improvement.`,
  });
  
  return response.text;
};
