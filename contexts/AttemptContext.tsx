import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  HypothesisDraft,
  ProblemWithApproaches,
  ScoreBreakdown,
  UserAttempt,
} from '@/types/database';
import type { OpenProblemIntent, OpenProblemOptions } from '@/lib/openProblem';
import { scoreHypothesis } from '@/lib/scoring';

export type ProblemFlowStep = 'statement' | 'radar' | 'hypothesis' | 'blueprint';

const FLOW_ORDER: ProblemFlowStep[] = ['statement', 'radar', 'hypothesis', 'blueprint'];

function stepRank(step: ProblemFlowStep): number {
  return FLOW_ORDER.indexOf(step);
}

type AttemptContextValue = {
  problem: ProblemWithApproaches | null;
  draft: HypothesisDraft | null;
  breakdown: ScoreBreakdown | null;
  furthestStep: ProblemFlowStep;
  /** Prior attempt for review/retry framing (reference only). */
  priorAttempt: UserAttempt | null;
  flowIntent: OpenProblemIntent;
  beginProblem: (problem: ProblemWithApproaches, opts?: OpenProblemOptions) => void;
  markStepReached: (step: ProblemFlowStep) => void;
  setComplexityGuess: (complexity: string, bonus: boolean) => void;
  setHypothesis: (
    partial: Partial<
      Pick<HypothesisDraft, 'paradigms' | 'algorithms' | 'dataStructures' | 'twists'>
    >,
  ) => void;
  setPseudocode: (text: string) => void;
  tickTime: () => void;
  finalizeScore: () => ScoreBreakdown | null;
  reset: () => void;
};

const AttemptContext = createContext<AttemptContextValue | null>(null);

const emptyDraft = (problemId: string): HypothesisDraft => ({
  problemId,
  paradigms: [],
  algorithms: [],
  dataStructures: [],
  twists: [],
  guessedComplexity: null,
  complexityBonus: false,
  pseudocode: '',
  startedAt: Date.now(),
  timeSpentSec: 0,
});

export function AttemptProvider({ children }: { children: React.ReactNode }) {
  const [problem, setProblem] = useState<ProblemWithApproaches | null>(null);
  const [draft, setDraft] = useState<HypothesisDraft | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [furthestStep, setFurthestStep] = useState<ProblemFlowStep>('statement');
  const [priorAttempt, setPriorAttempt] = useState<UserAttempt | null>(null);
  const [flowIntent, setFlowIntent] = useState<OpenProblemIntent>('fresh');

  const beginProblem = useCallback((p: ProblemWithApproaches, opts?: OpenProblemOptions) => {
    setProblem(p);
    setDraft(emptyDraft(p.id));
    setBreakdown(null);
    setFurthestStep('statement');
    setPriorAttempt(opts?.priorAttempt ?? null);
    setFlowIntent(opts?.intent ?? 'fresh');
  }, []);

  const markStepReached = useCallback((step: ProblemFlowStep) => {
    setFurthestStep((prev) => (stepRank(step) > stepRank(prev) ? step : prev));
  }, []);

  const setComplexityGuess = useCallback((complexity: string, bonus: boolean) => {
    setDraft((d) => (d ? { ...d, guessedComplexity: complexity, complexityBonus: bonus } : d));
  }, []);

  const setHypothesis = useCallback(
    (
      partial: Partial<
        Pick<HypothesisDraft, 'paradigms' | 'algorithms' | 'dataStructures' | 'twists'>
      >,
    ) => {
      setDraft((d) => (d ? { ...d, ...partial } : d));
    },
    [],
  );

  const setPseudocode = useCallback((text: string) => {
    setDraft((d) => (d ? { ...d, pseudocode: text } : d));
  }, []);

  const tickTime = useCallback(() => {
    setDraft((d) => {
      if (!d) return d;
      const elapsed = Math.floor((Date.now() - d.startedAt) / 1000);
      return { ...d, timeSpentSec: elapsed };
    });
  }, []);

  // Keep insight timer running for the whole Encounter → Reveal flow.
  const timingProblemId = draft?.problemId ?? null;
  useEffect(() => {
    if (!timingProblemId) return;
    const timer = setInterval(tickTime, 1000);
    return () => clearInterval(timer);
  }, [timingProblemId, tickTime]);

  const finalizeScore = useCallback(() => {
    if (!problem || !draft) return null;
    const result = scoreHypothesis(draft, problem.approaches, problem.target_complexity);
    setBreakdown(result);
    return result;
  }, [problem, draft]);

  const reset = useCallback(() => {
    setProblem(null);
    setDraft(null);
    setBreakdown(null);
    setFurthestStep('statement');
    setPriorAttempt(null);
    setFlowIntent('fresh');
  }, []);

  const value = useMemo(
    () => ({
      problem,
      draft,
      breakdown,
      furthestStep,
      priorAttempt,
      flowIntent,
      beginProblem,
      markStepReached,
      setComplexityGuess,
      setHypothesis,
      setPseudocode,
      tickTime,
      finalizeScore,
      reset,
    }),
    [
      problem,
      draft,
      breakdown,
      furthestStep,
      priorAttempt,
      flowIntent,
      beginProblem,
      markStepReached,
      setComplexityGuess,
      setHypothesis,
      setPseudocode,
      tickTime,
      finalizeScore,
      reset,
    ],
  );

  return <AttemptContext.Provider value={value}>{children}</AttemptContext.Provider>;
}

export function useAttempt() {
  const ctx = useContext(AttemptContext);
  if (!ctx) throw new Error('useAttempt must be used within AttemptProvider');
  return ctx;
}
