import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PressableScale } from '@/components/game/PressableScale';
import { ProseCard } from '@/components/ProseCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InteractiveGraphDrill } from '@/components/learn/InteractiveGraphDrill';
import { countExerciseBeats } from '@/lib/learnExerciseGen';
import type { LearnExercise, LearnMcq } from '@/types/learn';
import { colors, radii, spacing } from '@/constants/theme';

type Props = {
  exercises: LearnExercise[];
  onAllCleared?: () => void;
  /** Fresh procedural / reshuffled set (new graph, new seed). */
  onRetryFresh?: () => void;
};

type McqBeat = {
  kind: 'mcq';
  key: string;
  exerciseId: string;
  headline: string;
  beat: LearnMcq;
  stepLabel?: string;
  /** How many scored items this beat contributes. */
  weight: 1;
};

type GraphBeat = {
  kind: 'graph_predict';
  key: string;
  exercise: Extract<LearnExercise, { kind: 'graph_predict' }>;
  weight: number;
};

type FlatBeat = McqBeat | GraphBeat;

function flatten(exercises: LearnExercise[]): FlatBeat[] {
  const out: FlatBeat[] = [];
  for (const ex of exercises) {
    if (ex.kind === 'mcq') {
      out.push({
        kind: 'mcq',
        key: ex.id,
        exerciseId: ex.id,
        headline: 'Predict',
        beat: ex,
        weight: 1,
      });
    } else if (ex.kind === 'trace') {
      ex.steps.forEach((step, i) => {
        const context_md =
          [ex.context_md, step.context_md].filter(Boolean).join('\n\n') || undefined;
        out.push({
          kind: 'mcq',
          key: `${ex.id}-${i}`,
          exerciseId: ex.id,
          headline: ex.title,
          stepLabel: `Step ${i + 1}/${ex.steps.length}`,
          beat: { ...step, context_md },
          weight: 1,
        });
      });
    } else {
      out.push({
        kind: 'graph_predict',
        key: ex.id,
        exercise: ex,
        weight: ex.checkpoints.length,
      });
    }
  }
  return out;
}

async function haptic(ok: boolean) {
  try {
    if (ok) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    /* optional */
  }
}

export function LessonExercise({ exercises, onAllCleared, onRetryFresh }: Props) {
  const beats = useMemo(() => flatten(exercises), [exercises]);
  const totalWeight = useMemo(() => countExerciseBeats(exercises), [exercises]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [scoredSoFar, setScoredSoFar] = useState(0);
  const [finished, setFinished] = useState(false);

  // Fresh `exercises` should remount this component via `key` from the parent.

  if (!beats.length) {
    return <Text style={styles.empty}>No drills for this lesson yet.</Text>;
  }

  const current = beats[Math.min(index, beats.length - 1)]!;
  const weightBefore = beats.slice(0, index).reduce((s, b) => s + b.weight, 0);
  const progress = finished
    ? 1
    : totalWeight === 0
      ? 0
      : weightBefore / totalWeight;

  function finishOrAdvance() {
    if (index + 1 >= beats.length) {
      setFinished(true);
      onAllCleared?.();
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function choose(i: number) {
    if (current.kind !== 'mcq' || picked != null) return;
    setPicked(i);
    const ok = i === current.beat.answer;
    if (ok) setCorrectCount((c) => c + 1);
    setScoredSoFar((s) => s + 1);
    void haptic(ok);
  }

  function nextMcq() {
    finishOrAdvance();
  }

  function onGraphComplete(correct: number, total: number) {
    setCorrectCount((c) => c + correct);
    setScoredSoFar((s) => s + total);
    finishOrAdvance();
  }

  if (finished) {
    const perfect = correctCount === totalWeight && totalWeight > 0;
    return (
      <View style={styles.wrap}>
        <View style={[styles.resultCard, perfect && styles.resultPerfect]}>
          <Text style={styles.resultKicker}>{perfect ? 'PERFECT TRACE' : 'DRILL DONE'}</Text>
          <Text style={styles.resultTitle}>
            {correctCount}/{totalWeight} correct
          </Text>
          <Text style={styles.resultSub}>
            {perfect
              ? 'Clean read — pattern locked in.'
              : 'Review the misses, then continue the run.'}
          </Text>
        </View>
        <PrimaryButton
          label={onRetryFresh ? 'New drills' : 'Retry drills'}
          variant="secondary"
          onPress={() => {
            setIndex(0);
            setPicked(null);
            setCorrectCount(0);
            setScoredSoFar(0);
            setFinished(false);
            onRetryFresh?.();
          }}
        />
      </View>
    );
  }

  if (current.kind === 'graph_predict') {
    return (
      <View style={styles.wrap}>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={styles.counterSoft}>
          {scoredSoFar}/{totalWeight} scored · tap-next block
        </Text>
        <InteractiveGraphDrill
          key={current.key}
          exercise={current.exercise}
          onComplete={onGraphComplete}
        />
      </View>
    );
  }

  const revealed = picked != null;
  const isCorrect = picked === current.beat.answer;

  return (
    <View style={styles.wrap}>
      <View style={styles.metaRow}>
        <Text style={styles.headline}>{current.headline}</Text>
        <Text style={styles.counter}>
          {weightBefore + 1}/{totalWeight}
        </Text>
      </View>
      {current.stepLabel ? <Text style={styles.stepLabel}>{current.stepLabel}</Text> : null}

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      {current.beat.context_md ? <ProseCard markdown={current.beat.context_md} /> : null}

      <Text style={styles.prompt}>{current.beat.prompt}</Text>

      <View style={styles.choices}>
        {current.beat.choices.map((choice, i) => {
          const selected = picked === i;
          const showAnswer = revealed && i === current.beat.answer;
          const showWrong = revealed && selected && i !== current.beat.answer;
          return (
            <PressableScale
              key={`${current.key}-${i}`}
              disabled={revealed}
              haptic="light"
              scaleTo={0.97}
              onPress={() => choose(i)}
              style={[
                styles.choice,
                selected && !revealed && styles.choiceSelected,
                showAnswer && styles.choiceCorrect,
                showWrong && styles.choiceWrong,
              ]}
            >
              <Text style={styles.choiceIndex}>{String.fromCharCode(65 + i)}</Text>
              <Text
                style={[
                  styles.choiceText,
                  showAnswer && styles.choiceTextCorrect,
                  showWrong && styles.choiceTextWrong,
                ]}
              >
                {choice}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      {revealed ? (
        <View style={[styles.feedback, isCorrect ? styles.feedbackOk : styles.feedbackBad]}>
          <Text style={styles.feedbackTitle}>{isCorrect ? 'Correct' : 'Not quite'}</Text>
          {current.beat.explain_md ? (
            <ProseCard markdown={current.beat.explain_md} />
          ) : !isCorrect ? (
            <Text style={styles.feedbackHint}>
              Right answer: {current.beat.choices[current.beat.answer]}
            </Text>
          ) : null}
          <PrimaryButton
            label={index + 1 >= beats.length ? 'See results' : 'Next'}
            onPress={nextMcq}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  empty: { color: colors.textMuted },
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
  counterSoft: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  stepLabel: {
    color: colors.radar,
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.runTrack,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  prompt: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  choices: { gap: 8 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  choiceSelected: {
    borderColor: colors.chipSelectedBorder,
    backgroundColor: colors.chipSelected,
  },
  choiceCorrect: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  choiceWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
  },
  choiceIndex: {
    color: colors.textDim,
    fontFamily: 'SpaceMono',
    fontWeight: '900',
    fontSize: 14,
    width: 18,
  },
  choiceText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  choiceTextCorrect: { color: colors.accent },
  choiceTextWrong: { color: colors.danger },
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
  resultCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    gap: 4,
  },
  resultPerfect: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  resultKicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  resultSub: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
