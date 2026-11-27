import ioFormats from '@/data/io-formats.json';
import type { ProblemWithApproaches } from '@/types/database';

type IoOverlay = { input_format_md?: string; output_format_md?: string };

/** Fill empty I/O format fields from the curated overlay (metadata only — not statements). */
export function withIoFormats(p: ProblemWithApproaches): ProblemWithApproaches {
  const overlay = (ioFormats as Record<string, IoOverlay>)[p.id];
  return {
    ...p,
    input_format_md: p.input_format_md?.trim() || overlay?.input_format_md || '',
    output_format_md: p.output_format_md?.trim() || overlay?.output_format_md || '',
  };
}
