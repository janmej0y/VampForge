import { NextResponse } from "next/server";
import { clearGithubSession } from "@/lib/github-session";

export async function POST() {
  clearGithubSession();
  return NextResponse.json({ connected: false });
}
