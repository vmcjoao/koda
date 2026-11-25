import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { HypothesisDraft, ProblemWithApproaches, ScoreBreakdown } from '@/types/database';
import { scoreHypothesis } from '@/lib/scoring';

type AttemptContextValue = {
  problem: ProblemWithApproaches | null;
  draft: HypothesisDraft | null;
  breakdown: ScoreBreakdown | null;
  beginProblem: (problem: ProblemWithApproaches) => void;
  setComplexityGuess: (complexity: string, bonus: boolean) => void;
  setHypothesis: ( partial: Partial<Pick<HypothesisDraft, 'paradigms' | 'algorithms' | 'dataStructures' | 'twists'>>) => void;
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

  const beginProblem = useCallback((p: ProblemWithApproaches) => {
    setProblem(p);
    setDraft(emptyDraft(p.id));
    setBreakdown(null);
  }, []);

  const setComplexityGuess = useCallback((complexity: string, bonus: boolean) => {
    setDraft((d) => (d ? { ...d, guessedComplexity: complexity, complexityBonus: bonus } : d));
  }, []);

  const setHypothesis = useCallback(
    (partial: Partial<Pick<HypothesisDraft, 'paradigms' | 'algorithms' | 'dataStructures' | 'twists'>>) => {
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
  }, []);

  const value = useMemo(
    () => ({
      problem,
      draft,
      breakdown,
      beginProblem,
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
      beginProblem,
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
