import ufvTemplates from '@/data/playlist-templates/ufv.json';
import { upsertPlaylist, type Playlist } from '@/lib/playlists';

export type PlaylistTemplateEntry = {
  letter: string;
  title: string;
  vjudgeKey: string | null;
  originUrl: string | null;
  proposedId: string;
  proposedSource: string;
  proposedUrl: string | null;
  catalogId: string | null;
  status: 'in_catalog' | 'pending' | 'custom';
};

export type PlaylistTemplate = {
  id: string;
  name: string;
  description: string;
  groupShortName: string;
  groupTitle: string | null;
  contestId: string;
  contestUrl: string | null;
  entries: PlaylistTemplateEntry[];
};

type TemplatesFile = {
  generatedAt?: string;
  summary?: {
    uniqueProblems?: number;
    inCatalog?: number;
    pending?: number;
  };
  templates?: PlaylistTemplate[];
};

function loadUfv(): TemplatesFile {
  return ufvTemplates as TemplatesFile;
}

export function listUfvPlaylistTemplates(): PlaylistTemplate[] {
  const data = loadUfv();
  return Array.isArray(data.templates) ? data.templates : [];
}

export function ufvTemplateSummary(): {
  contests: number;
  inCatalog: number;
  pending: number;
  uniqueProblems: number;
} {
  const data = loadUfv();
  const templates = listUfvPlaylistTemplates();
  return {
    contests: templates.length,
    inCatalog: data.summary?.inCatalog ?? 0,
    pending: data.summary?.pending ?? 0,
    uniqueProblems: data.summary?.uniqueProblems ?? 0,
  };
}

/**
 * Import UFV contest playlists. Only problem ids present in `availableIds` are kept
 * (matched catalog + any already-ingested proposed ids).
 * Skips contests that would be empty. Upserts by stable template id.
 */
export async function importUfvPlaylistTemplates(
  availableIds: Set<string> | string[],
): Promise<{ imported: Playlist[]; skippedEmpty: number }> {
  const available = availableIds instanceof Set ? availableIds : new Set(availableIds);
  const templates = listUfvPlaylistTemplates();
  const imported: Playlist[] = [];
  let skippedEmpty = 0;

  for (const t of templates) {
    const problemIds: string[] = [];
    const seen = new Set<string>();
    for (const e of t.entries) {
      const id = e.catalogId && available.has(e.catalogId)
        ? e.catalogId
        : available.has(e.proposedId)
          ? e.proposedId
          : null;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      problemIds.push(id);
    }
    if (!problemIds.length) {
      skippedEmpty += 1;
      continue;
    }
    const playlist = await upsertPlaylist({
      id: t.id,
      name: t.name,
      description: t.description,
      problemIds,
    });
    imported.push(playlist);
  }

  return { imported, skippedEmpty };
}
