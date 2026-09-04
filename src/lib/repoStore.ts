import { useSyncExternalStore } from 'react';
import snapshotJson from '@/data/github.json';
import { projects } from '@/content/site';
import { fetchRepoSnapshot, type RepoSnapshot } from '@/lib/github';

type Snapshots = Record<string, RepoSnapshot>;
type State = { snapshots: Snapshots; live: boolean; failed: boolean };

let state: State = {
  snapshots: snapshotJson as Snapshots,
  live: false,
  failed: false,
};
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;

let refreshed = false;

export function refreshRepos() {
  if (refreshed) return;
  refreshed = true;
  void Promise.all(
    projects.map(async (project) => {
      const snapshot = await fetchRepoSnapshot(
        project.repo.owner,
        project.repo.name,
      );
      return [project.slug, snapshot] as const;
    }),
  )
    .then((entries) => {
      emit({
        snapshots: { ...state.snapshots, ...Object.fromEntries(entries) },
        live: true,
        failed: false,
      });
    })
    .catch(() => emit({ ...state, failed: true }));
}

export function useRepoState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useRepoSnapshot(slug: string): RepoSnapshot | null {
  return useRepoState().snapshots[slug] ?? null;
}
