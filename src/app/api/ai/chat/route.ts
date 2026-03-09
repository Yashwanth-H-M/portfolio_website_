import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const result = await streamText({
    model: google("gemini-1.5-pro") as any,
    messages,
    system: `You are GIP.OS Intelligence Assistant. 
    Answer the user's query based on the current platform context.
    Keep it concise, analytical, and professional.
    
    Context: ${JSON.stringify(context)}`,
  });

  return result.toTextStreamResponse();
}
