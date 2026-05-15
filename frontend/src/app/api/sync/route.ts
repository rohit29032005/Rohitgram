import { NextResponse } from 'next/server';

export async function POST() {
  const GITHUB_TOKEN = process.env.GITHUB_SYNC_TOKEN;
  const REPO_OWNER = "rohit29032005";
  const REPO_NAME = "Rohitgram";
  const WORKFLOW_ID = "sync.yml";

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_SYNC_TOKEN not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          ref: "main", // or master if that's your branch
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({ message: "Sync triggered successfully" });
    } else {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to trigger sync" }, { status: 500 });
  }
}
