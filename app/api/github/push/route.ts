import { NextRequest, NextResponse } from "next/server";
import { getGithubSessionToken } from "@/lib/github-session";

type PushRequestBody = {
  portfolioName?: string;
  repoName?: string;
  customDomain?: string;
  environment?: "production" | "preview";
  files?: Array<{
    path?: string;
    content?: string;
  }>;
};

type GithubUser = {
  login: string;
};

type GithubRepo = {
  html_url: string;
  default_branch?: string;
};

type GithubContent = {
  sha?: string;
};

function normalizeRepoName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "vampforge-portfolio"
  );
}

function encodeGithubPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function normalizeFiles(files: PushRequestBody["files"]) {
  if (!Array.isArray(files)) return [];

  return files
    .map((file) => ({
      path: typeof file.path === "string" ? file.path.trim().replace(/^\/+/, "") : "",
      content: typeof file.content === "string" ? file.content : "",
    }))
    .filter((file) => {
      if (!file.path || !file.content) return false;
      if (file.path.includes("..") || file.path.startsWith(".git/")) return false;
      return file.path.length <= 220;
    });
}

async function githubFetch<T>(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) as T : null;

  return { response, data };
}

async function getExistingFileSha(
  token: string,
  owner: string,
  repo: string,
  path: string
) {
  const { response, data } = await githubFetch<GithubContent>(
    `/repos/${owner}/${repo}/contents/${encodeGithubPath(path)}`,
    token
  );

  if (!response.ok) return undefined;
  return data?.sha;
}

function createStarterFiles(
  body: Required<Omit<PushRequestBody, "files">>,
  owner: string
) {
  const title = body.portfolioName || "My Developer Portfolio";
  const domain = body.customDomain || "your-domain.com";
  const mode = body.environment === "production" ? "Production" : "Preview";

  return [
    {
      path: "README.md",
      content: `# ${title}

Generated from VampForge.

- Owner: ${owner}
- Mode: ${mode}
- Preferred domain: ${domain}

This repository is ready for a portfolio export, Vercel import, or manual customization.
`,
    },
    {
      path: "index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #07111f; color: #eef6ff; }
      main { width: min(920px, calc(100% - 32px)); padding: 48px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); }
      span { color: #5eead4; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 12px; }
      h1 { margin: 16px 0 0; font-size: clamp(42px, 8vw, 82px); letter-spacing: -.06em; line-height: .95; }
      p { max-width: 620px; color: #a7b7cc; line-height: 1.8; font-size: 18px; }
      a { color: #facc15; }
    </style>
  </head>
  <body>
    <main>
      <span>${mode} portfolio</span>
      <h1>${title}</h1>
      <p>This repo was created from VampForge. Replace this starter page with your exported portfolio code, then deploy it on Vercel.</p>
      <p><a href="https://${domain}">${domain}</a></p>
    </main>
  </body>
</html>
`,
    },
  ];
}

export async function POST(request: NextRequest) {
  const token = getGithubSessionToken();

  if (!token) {
    return NextResponse.json({ error: "GitHub is not connected." }, { status: 401 });
  }

  const body = (await request.json()) as PushRequestBody;
  const repoName = normalizeRepoName(body.repoName || body.portfolioName || "");

  const { response: userResponse, data: user } = await githubFetch<GithubUser>("/user", token);

  if (!userResponse.ok || !user?.login) {
    return NextResponse.json({ error: "Could not read GitHub account." }, { status: 401 });
  }

  let repoUrl = `https://github.com/${user.login}/${repoName}`;
  const repoPayload = {
    name: repoName,
    description: `${body.portfolioName || "VampForge portfolio"} generated from VampForge.`,
    private: false,
    auto_init: true,
  };

  const { response: createRepoResponse, data: createdRepo } = await githubFetch<GithubRepo>(
    "/user/repos",
    token,
    {
      method: "POST",
      body: JSON.stringify(repoPayload),
    }
  );

  if (createRepoResponse.ok && createdRepo?.html_url) {
    repoUrl = createdRepo.html_url;
  } else if (createRepoResponse.status !== 422) {
    return NextResponse.json(
      { error: "GitHub could not create the repository." },
      { status: createRepoResponse.status }
    );
  }

  const files = normalizeFiles(body.files);
  const filesToPush = files.length
    ? files
    : createStarterFiles(
        {
          portfolioName: body.portfolioName || "My Developer Portfolio",
          repoName,
          customDomain: body.customDomain || "your-domain.com",
          environment: body.environment || "production",
        },
        user.login
      );

  for (const file of filesToPush) {
    const sha = await getExistingFileSha(token, user.login, repoName, file.path);
    const { response } = await githubFetch(
      `/repos/${user.login}/${repoName}/contents/${encodeGithubPath(file.path)}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Update ${file.path} from VampForge`,
          content: Buffer.from(file.content, "utf8").toString("base64"),
          ...(sha ? { sha } : {}),
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub could not update ${file.path}.` },
        { status: response.status }
      );
    }
  }

  return NextResponse.json({
    url: repoUrl,
    owner: user.login,
    repo: repoName,
  });
}
