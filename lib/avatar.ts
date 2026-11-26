/** Glyph avatars — no photo upload; stored on local profile as `avatar_id`. */

export type AvatarPreset = {
  id: string;
  glyph: string;
  /** Accent used for ring / glyph */
  color: string;
  label: string;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'bolt', glyph: '↯', color: '#3DDC97', label: 'Bolt' },
  { id: 'node', glyph: '◆', color: '#5B8CFF', label: 'Node' },
  { id: 'orbit', glyph: '◎', color: '#F0C14B', label: 'Orbit' },
  { id: 'sigma', glyph: 'Σ', color: '#F5A623', label: 'Sigma' },
  { id: 'hash', glyph: '#', color: '#FF6B6B', label: 'Hash' },
  { id: 'lambda', glyph: 'λ', color: '#C084FC', label: 'Lambda' },
  { id: 'grid', glyph: '▦', color: '#2DD4BF', label: 'Grid' },
  { id: 'path', glyph: '↗', color: '#FB7185', label: 'Path' },
];

const DEFAULT_ID = 'bolt';

export function getAvatarPreset(id: string | null | undefined): AvatarPreset {
  return AVATAR_PRESETS.find((p) => p.id === id) ?? AVATAR_PRESETS[0]!;
}

export function defaultAvatarId(): string {
  return DEFAULT_ID;
}

/** 1–2 letter initials from display name. */
export function initialsFromName(name: string | null | undefined): string {
  const parts = (name ?? 'Coder').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'KO';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
}
