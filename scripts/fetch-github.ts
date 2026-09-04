import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/content/site';
import { fetchRepoSnapshot, type RepoSnapshot } from '../src/lib/github';

const outPath = path.join(process.cwd(), 'src/data/github.json');

async function readExisting(): Promise<Record<string, RepoSnapshot>> {
  try {
    return JSON.parse(await readFile(outPath, 'utf8')) as Record<
      string,
      RepoSnapshot
    >;
  } catch {
    return {};
  }
}

const existing = await readExisting();
const next: Record<string, RepoSnapshot> = { ...existing };

for (const project of projects) {
  try {
    next[project.slug] = await fetchRepoSnapshot(
      project.repo.owner,
      project.repo.name,
      { token: process.env.GITHUB_TOKEN },
    );
    console.log(`github: ${project.repo.owner}/${project.repo.name} refreshed`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`github: kept cached ${project.slug} (${reason})`);
  }
}

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(next, null, 2)}\n`);
