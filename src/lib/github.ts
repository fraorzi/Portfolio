export type RepoCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export type RepoLanguage = { name: string; share: number };

export type RepoSnapshot = {
  fullName: string;
  url: string;
  createdAt: string;
  pushedAt: string;
  stars: number;
  commitCount: number | null;
  languages: readonly RepoLanguage[];
  commits: readonly RepoCommit[];
  weekly: readonly number[];
  fetchedAt: string;
};

export const WEEKS = 12;
const COMMITS_SHOWN = 6;
const MAX_COMMIT_PAGES = 4;
const API = 'https://api.github.com';

type RepoResponse = {
  full_name: string;
  html_url: string;
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
};

type CommitResponse = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
};

export type FetchOptions = { token?: string };

async function getJson<T>(
  path: string,
  options: FetchOptions,
): Promise<{ data: T; link: string }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`${API}${path}`, { headers });
  if (!response.ok) throw new Error(`github ${path}: ${response.status}`);
  return {
    data: (await response.json()) as T,
    link: response.headers.get('link') ?? '',
  };
}

function lastPage(link: string): number | null {
  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? Number(match[1]) : null;
}

function weeklyBuckets(dates: readonly string[], now: Date): number[] {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const buckets = new Array<number>(WEEKS).fill(0);
  for (const iso of dates) {
    const age = now.getTime() - new Date(iso).getTime();
    const index = WEEKS - 1 - Math.floor(age / weekMs);
    if (index >= 0 && index < WEEKS) buckets[index] += 1;
  }
  return buckets;
}

export function languageShares(bytes: Record<string, number>): RepoLanguage[] {
  const total = Object.values(bytes).reduce((sum, n) => sum + n, 0);
  if (!total) return [];
  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, n]) => ({ name, share: n / total }));
}

async function fetchRecentCommits(
  base: string,
  since: Date,
  options: FetchOptions,
) {
  const all: CommitResponse[] = [];
  for (let page = 1; page <= MAX_COMMIT_PAGES; page += 1) {
    const { data, link } = await getJson<CommitResponse[]>(
      `${base}/commits?since=${since.toISOString()}&per_page=100&page=${page}`,
      options,
    );
    all.push(...data);
    if (!link.includes('rel="next"')) break;
  }
  return all;
}

export async function fetchRepoSnapshot(
  owner: string,
  name: string,
  options: FetchOptions = {},
  now = new Date(),
): Promise<RepoSnapshot> {
  const base = `/repos/${owner}/${name}`;
  const since = new Date(now.getTime() - WEEKS * 7 * 24 * 60 * 60 * 1000);
  const [repo, languages, commits, head] = await Promise.all([
    getJson<RepoResponse>(base, options),
    getJson<Record<string, number>>(`${base}/languages`, options),
    fetchRecentCommits(base, since, options),
    getJson<CommitResponse[]>(`${base}/commits?per_page=1`, options),
  ]);

  const dates = commits
    .map((c) => c.commit.author?.date)
    .filter((d): d is string => Boolean(d));

  return {
    fullName: repo.data.full_name,
    url: repo.data.html_url,
    createdAt: repo.data.created_at,
    pushedAt: repo.data.pushed_at,
    stars: repo.data.stargazers_count,
    commitCount: lastPage(head.link) ?? commits.length,
    languages: languageShares(languages.data),
    commits: commits.slice(0, COMMITS_SHOWN).map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      date: c.commit.author?.date ?? repo.data.pushed_at,
      url: c.html_url,
    })),
    weekly: weeklyBuckets(dates, now),
    fetchedAt: now.toISOString(),
  };
}
