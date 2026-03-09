import { NextResponse } from "next/server";
import { generateExecutiveSummary } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { entityName, data } = await req.json();
    const summary = await generateExecutiveSummary({ entityName, ...data });
    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
