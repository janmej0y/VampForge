import { NextResponse } from "next/server";
import { getGithubSessionToken } from "@/lib/github-session";

type GithubUser = {
  login?: string;
  avatar_url?: string;
  html_url?: string;
};

export async function GET() {
  const token = getGithubSessionToken();

  if (!token) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const user = (await response.json()) as GithubUser;

  return NextResponse.json({
    connected: true,
    username: user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
  });
}
