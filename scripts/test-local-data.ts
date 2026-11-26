import assert from 'assert';
import { importLocalTrainingJson } from '../lib/localData';

async function main() {
  const bad = await importLocalTrainingJson('{not json');
  assert.strictEqual(bad.ok, false);

  const wrongApp = await importLocalTrainingJson(JSON.stringify({ app: 'other' }));
  assert.strictEqual(wrongApp.ok, false);

  // Empty recognizable payload
  const empty = await importLocalTrainingJson(JSON.stringify({ app: 'koda' }));
  assert.strictEqual(empty.ok, false);

  console.log('local-data import validation tests passed');
}

main();
