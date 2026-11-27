import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ProseCard } from '@/components/ProseCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GraphSearchViz } from '@/components/learn/viz/GraphSearchViz';
import {
  buildBfsSteps,
  buildDfsSteps,
  buildDijkstraSteps,
  buildMstSteps,
  buildTopoSteps,
  type GraphStep,
} from '@/lib/learnViz';
import type { LearnExercise } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

type GraphPredictExercise = Extract<LearnExercise, { kind: 'graph_predict' }>;

type Props = {
  exercise: GraphPredictExercise;
  /** Called once when every checkpoint is finished. */
  onComplete: (correct: number, total: number) => void;
};

const TICK_MS = 350;

function buildSteps(ex: GraphPredictExercise): GraphStep[] {
  switch (ex.algo) {
    case 'bfs':
      return buildBfsSteps(ex.demo);
    case 'dfs':
      return buildDfsSteps(ex.demo);
    case 'dijkstra':
      return buildDijkstraSteps(ex.demo);
    case 'topo':
      return buildTopoSteps(ex.demo);
    case 'mst':
      return buildMstSteps(ex.demo);
    default:
      return buildBfsSteps(ex.demo);
  }
}

async function haptic(ok: boolean) {
  try {
    if (ok) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    /* optional */
  }
}

type Phase = 'playing' | 'ask' | 'revealed';

export function InteractiveGraphDrill({ exercise, onComplete }: Props) {
  const steps = useMemo(() => buildSteps(exercise), [exercise]);
  const checkpoints = exercise.checkpoints;
  const [cpIndex, setCpIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const correctRef = useRef(0);

  const cp = checkpoints[Math.min(cpIndex, checkpoints.length - 1)]!;
  const freezeAt = Math.max(0, Math.min(cp.freezeAt, Math.max(0, steps.length - 1)));
  const playFrom =
    cpIndex === 0 ? 0 : Math.min(checkpoints[cpIndex - 1]!.freezeAt, freezeAt);

  // Autoplay ticks toward freezeAt (updates only from timers — not sync in effect body).
  useEffect(() => {
    if (phase !== 'playing') return;
    let cancelled = false;
    let s = playFrom;

    const goAsk = () => {
      if (cancelled) return;
      setStep(freezeAt);
      setPhase('ask');
    };

    if (playFrom >= freezeAt) {
      const t = setTimeout(goAsk, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    const t0 = setTimeout(() => {
      if (!cancelled) setStep(playFrom);
    }, 0);

    const id = setInterval(() => {
      s += 1;
      if (cancelled) return;
      if (s >= freezeAt) {
        clearInterval(id);
        goAsk();
      } else {
        setStep(s);
      }
    }, TICK_MS);

    return () => {
      cancelled = true;
      clearTimeout(t0);
      clearInterval(id);
    };
  }, [phase, playFrom, freezeAt, cpIndex]);

  const feedback = useMemo(() => {
    if (phase !== 'revealed' || picked == null) return undefined;
    const fb: Record<string, 'correct' | 'wrong'> = {
      [cp.answerNodeId]: 'correct',
    };
    if (picked !== cp.answerNodeId) fb[picked] = 'wrong';
    return fb;
  }, [phase, picked, cp.answerNodeId]);

  function skipToAsk() {
    if (phase !== 'playing') return;
    setStep(freezeAt);
    setPhase('ask');
  }

  function onNodePress(nodeId: string) {
    if (phase !== 'ask' || picked != null) return;
    setPicked(nodeId);
    const ok = nodeId === cp.answerNodeId;
    if (ok) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
    }
    void haptic(ok);
    setPhase('revealed');
  }

  function continueNext() {
    if (cpIndex + 1 >= checkpoints.length) {
      onComplete(correctRef.current, checkpoints.length);
      return;
    }
    setCpIndex((i) => i + 1);
    setPicked(null);
    setPhase('playing');
  }

  const graphStep = steps[Math.min(step, Math.max(0, steps.length - 1))];
  const isCorrect = picked === cp.answerNodeId;

  return (
    <View style={styles.wrap}>
      <View style={styles.metaRow}>
        <Text style={styles.headline}>{exercise.title}</Text>
        <Text style={styles.counter}>
          {cpIndex + 1}/{checkpoints.length}
        </Text>
      </View>
      <Text style={styles.stepLabel}>
        {phase === 'playing'
          ? `Replaying · step ${step}/${freezeAt}`
          : `Checkpoint ${cpIndex + 1}`}
      </Text>

      <GraphSearchViz
        demo={exercise.demo}
        step={graphStep}
        interactive={phase === 'ask'}
        onNodePress={phase === 'ask' ? onNodePress : undefined}
        feedback={feedback}
      />

      {phase === 'playing' ? (
        <PrimaryButton label="Skip to ask" variant="ghost" onPress={skipToAsk} />
      ) : null}

      {phase === 'ask' || phase === 'revealed' ? (
        <Text style={styles.prompt}>{cp.prompt}</Text>
      ) : null}

      {phase === 'ask' ? (
        <Text style={styles.hint}>Tap the next vertex</Text>
      ) : null}

      {phase === 'revealed' ? (
        <View style={[styles.feedback, isCorrect ? styles.feedbackOk : styles.feedbackBad]}>
          <Text style={styles.feedbackTitle}>{isCorrect ? 'Correct' : 'Not quite'}</Text>
          {cp.explain_md ? <ProseCard markdown={cp.explain_md} /> : null}
          {!isCorrect ? (
            <Text style={styles.feedbackHint}>Right node: {cp.answerNodeId}</Text>
          ) : null}
          <PrimaryButton
            label={cpIndex + 1 >= checkpoints.length ? 'Continue' : 'Next checkpoint'}
            onPress={continueNext}
          />
        </View>
      ) : null}

      {correctCount > 0 && phase !== 'revealed' ? (
        <Text style={styles.scoreSoft}>
          {correctCount} correct so far
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headline: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  counter: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontWeight: '800',
    fontSize: 12,
  },
  stepLabel: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
  },
  prompt: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  scoreSoft: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  feedback: {
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  feedbackOk: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  feedbackBad: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  feedbackHint: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
