import assert from 'assert';
import { LESSONS } from '../data/learn/lessons';
import { buildExercises, countExerciseBeats } from '../lib/learnExerciseGen';

function fingerprint(exs: ReturnType<typeof buildExercises>): string {
  return exs
    .map((e) => {
      if (e.kind === 'mcq') return `m:${e.prompt}`;
      if (e.kind === 'graph_predict') {
        return `g:${e.demo.start}:${e.demo.edges.map((x) => `${x.from}-${x.to}:${x.w ?? 1}`).join(',')}:${e.checkpoints.map((c) => c.answerNodeId).join('/')}`;
      }
      return `t:${e.title}:${e.steps.map((s) => s.prompt).join('|')}`;
    })
    .join('||');
}

for (const lesson of LESSONS) {
  const a = buildExercises(lesson.id, 101);
  const b = buildExercises(lesson.id, 202);
  assert.ok(
    countExerciseBeats(a) >= 5,
    `${lesson.id} seed=101 should have ≥5 beats (got ${countExerciseBeats(a)})`,
  );
  assert.ok(
    countExerciseBeats(b) >= 5,
    `${lesson.id} seed=202 should have ≥5 beats (got ${countExerciseBeats(b)})`,
  );
  assert.notStrictEqual(
    fingerprint(a),
    fingerprint(b),
    `${lesson.id}: New drills seeds should change content`,
  );
}

console.log('exercise-variety tests passed');
