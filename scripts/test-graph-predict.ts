import assert from 'assert';
import {
  buildExercises,
  pickGraphPredictCheckpoints,
} from '../lib/learnExerciseGen';
import {
  buildBfsSteps,
  buildDfsSteps,
  buildDijkstraSteps,
} from '../lib/learnViz';
import { DEMO_BFS, DEMO_DFS, DEMO_DIJKSTRA } from '../data/learn/graph-demos';
import type { LearnExercise } from '../types/learn';

function assertCheckpointsMatch(
  steps: ReturnType<typeof buildBfsSteps>,
  kind: 'visit' | 'enter' | 'settle',
) {
  const cps = pickGraphPredictCheckpoints(steps, kind);
  assert.ok(cps.length >= 1, `${kind}: expected ≥1 checkpoint`);
  for (const cp of cps) {
    assert.ok(cp.freezeAt >= 0, 'freezeAt ≥ 0');
    assert.ok(cp.freezeAt + 1 < steps.length, 'freezeAt+1 in range');
    const visit = steps[cp.freezeAt + 1]!;
    const expected =
      kind === 'settle'
        ? /^settle (\S+)/.exec(visit.label)?.[1]
        : kind === 'visit'
          ? /^visit (\S+)$/.exec(visit.label)?.[1]
          : /^enter (\S+)$/.exec(visit.label)?.[1];
    assert.strictEqual(
      cp.answerNodeId,
      expected,
      `${kind}: answer at freeze ${cp.freezeAt} should be next visit (${visit.label})`,
    );
  }
}

{
  assertCheckpointsMatch(buildBfsSteps(DEMO_BFS), 'visit');
  assertCheckpointsMatch(buildDfsSteps(DEMO_DFS), 'enter');
  assertCheckpointsMatch(buildDijkstraSteps(DEMO_DIJKSTRA), 'settle');
}

function hasPredict(exs: LearnExercise[]): boolean {
  return exs.some((e) => e.kind === 'graph_predict' && e.checkpoints.length >= 1);
}

for (const lessonId of ['bfs', 'dfs', 'dijkstra'] as const) {
  for (let seed = 1; seed <= 12; seed++) {
    const exs = buildExercises(lessonId, seed * 997);
    assert.ok(hasPredict(exs), `${lessonId} seed=${seed} should emit graph_predict`);
    const gp = exs.find((e) => e.kind === 'graph_predict');
    assert.ok(gp && gp.kind === 'graph_predict');
    for (const cp of gp.checkpoints) {
      assert.ok(
        gp.demo.nodes.some((n) => n.id === cp.answerNodeId),
        'answer node exists on demo',
      );
      assert.ok(cp.freezeAt >= 0);
    }
    const steps =
      lessonId === 'bfs'
        ? buildBfsSteps(gp.demo)
        : lessonId === 'dfs'
          ? buildDfsSteps(gp.demo)
          : buildDijkstraSteps(gp.demo);
    for (const cp of gp.checkpoints) {
      const next = steps[cp.freezeAt + 1];
      assert.ok(next, `step after freeze ${cp.freezeAt}`);
      assert.ok(
        next.label.includes(cp.answerNodeId),
        `next step "${next.label}" should mention ${cp.answerNodeId}`,
      );
    }
    assert.ok(
      exs.some((e) => e.kind === 'mcq'),
      `${lessonId} keeps a short MCQ alongside predict`,
    );
  }
}

console.log('graph-predict tests passed');
