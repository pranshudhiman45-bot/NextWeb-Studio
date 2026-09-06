import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";

export async function GET() {
  return NextResponse.json({ success: true, data: projects });
}
