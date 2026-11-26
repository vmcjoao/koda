export type AttemptStatus = 'drafted' | 'needs_review' | 'implemented_ac';

export type TagKind = 'paradigm' | 'algorithm' | 'data_structure' | 'complexity' | 'twist';

export type SampleIO = {
  input: string;
  output: string;
  explanation?: string;
};

export type Problem = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  /** How the input is structured (expected input format). Prefer always set for new problems. */
  input_format_md?: string;
  /** What to print (expected output format). Prefer always set for new problems. */
  output_format_md?: string;
  constraints_text: string;
  sample_io: SampleIO[];
  target_complexity: string;
  created_at?: string;
};

export type SolutionApproach = {
  id: string;
  problem_id: string;
  approach_name: string;
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  key_insights: string[];
  editorial_summary_md: string;
};

export type TagCatalogEntry = {
  id: string;
  kind: TagKind;
  label: string;
  aliases: string[];
};

export type UserProfile = {
  user_id: string;
  display_name: string | null;
  rating_band: number;
  streak: number;
  xp: number;
  last_active_date: string | null;
  /** Local glyph avatar id (`lib/avatar` presets). Not a DB column yet. */
  avatar_id?: string | null;
};

export type UserAttempt = {
  id: string;
  user_id: string;
  problem_id: string;
  timestamp: string;
  time_spent_sec: number;
  selected_paradigms: string[];
  selected_algorithms: string[];
  selected_ds: string[];
  selected_twists: string[];
  guessed_complexity: string | null;
  complexity_bonus: boolean;
  user_twist_notes: string | null;
  pseudocode_draft: string | null;
  score_accuracy: number;
  matched_approach_id: string | null;
  status: AttemptStatus;
  mistake_types: string[];
};

export type UserProblemState = {
  user_id: string;
  problem_id: string;
  is_solved: boolean;
  attempt_count: number;
  next_review_date: string | null;
  best_score: number;
};

export type ProblemWithApproaches = Problem & {
  approaches: SolutionApproach[];
};

export type ScoreBreakdown = {
  score: number;
  matchedApproach: SolutionApproach | null;
  paradigmScore: number;
  algorithmScore: number;
  dsScore: number;
  twistScore: number;
  complexityBonus: boolean;
  mistakeTypes: string[];
};

export type HypothesisDraft = {
  problemId: string;
  paradigms: string[];
  algorithms: string[];
  dataStructures: string[];
  twists: string[];
  guessedComplexity: string | null;
  complexityBonus: boolean;
  pseudocode: string;
  startedAt: number;
  timeSpentSec: number;
};
