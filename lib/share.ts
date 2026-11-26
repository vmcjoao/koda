import { Share } from 'react-native';

export async function shareText(title: string, message: string) {
  await Share.share({ title, message });
}

export function formatScoreShare(input: {
  title: string;
  score: number;
  approachName?: string | null;
  paradigms: string[];
  algorithms: string[];
  twists: string[];
  complexityBonus: boolean;
  band: number;
}) {
  const tags = [...input.paradigms, ...input.algorithms].join(', ') || '—';
  const twists = input.twists.length ? input.twists.join('; ') : '—';
  return [
    `Koda · ${input.title}`,
    `Score ${input.score}%${input.complexityBonus ? ' · radar bonus' : ''}`,
    input.approachName ? `Matched: ${input.approachName}` : null,
    `Tags: ${tags}`,
    `Twists: ${twists}`,
    `Band ${input.band}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatBlueprintShare(input: {
  title: string;
  url?: string | null;
  draft: string;
  score?: number;
}) {
  return [
    `Koda blueprint · ${input.title}`,
    input.score != null ? `Hypothesis score: ${input.score}%` : null,
    input.url ? `OJ: ${input.url}` : null,
    '',
    input.draft.trim() || '(empty draft)',
  ]
    .filter((line) => line !== null)
    .join('\n');
}
