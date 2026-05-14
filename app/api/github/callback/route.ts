import { NextRequest, NextResponse } from "next/server";
import { setGithubSession } from "@/lib/github-session";

type GithubTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

function getBaseUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL?.replace(/^/, "https://") ||
    request.nextUrl.origin
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const baseUrl = getBaseUrl(request);

  if (!code || state !== "vampforge-github-connect") {
    return NextResponse.redirect(`${baseUrl}/deploy?github=invalid`);
  }

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/deploy?github=missing-env`);
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${baseUrl}/api/github/callback`,
    }),
  });

  const tokenData = (await tokenResponse.json()) as GithubTokenResponse;

  if (!tokenResponse.ok || !tokenData.access_token) {
    const reason = tokenData.error || "token-failed";
    return NextResponse.redirect(`${baseUrl}/deploy?github=${encodeURIComponent(reason)}`);
  }

  setGithubSession(tokenData.access_token);
  return NextResponse.redirect(`${baseUrl}/deploy?github=connected`);
}
