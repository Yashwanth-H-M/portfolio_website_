import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const geminiModel = google("gemini-1.5-pro");

/**
 * Generates an executive summary based on entity data.
 */
export async function generateExecutiveSummary(entityData: any) {
  if (!apiKey) {
    return "AI Integration is currently in mock mode. Please provide a GOOGLE_GENERATIVE_AI_API_KEY to enable live intelligence.";
  }

  try {
    const { text } = await generateText({
      model: geminiModel,
      prompt: `Act as a high-level geopolitical and financial intelligence analyst. 
      Generate a concise, professional executive summary (max 3 sentences) for the following entity.
      Highlight key risks, corporate stature, and any notable global connections.
      
      Entity Data: ${JSON.stringify(entityData)}`,
    });
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI summary. Please check your API configuration.";
  }
}

/**
 * Handles chat queries for AskGIP.
 */
export async function askGIP(query: string, context: any) {
  if (!apiKey) {
    return { text: "I'm in standby mode. Add a Gemini API key to start our conversation." };
  }

  return streamText({
    model: geminiModel,
    prompt: `You are GIP.OS Intelligence Assistant. 
    Answer the user's query based on the current platform context.
    Keep it concise, analytical, and professional.
    
    Context: ${JSON.stringify(context)}
    User Query: ${query}`,
  });
}
