import assert from 'assert';

// Pure helpers mirrored from playlists merge behavior
function mergeByUpdatedAt<T extends { id: string; updatedAt: string }>(
  remote: T[],
  local: T[],
): T[] {
  const byId = new Map<string, T>();
  for (const p of remote) byId.set(p.id, p);
  for (const p of local) {
    const prev = byId.get(p.id);
    if (!prev || p.updatedAt >= prev.updatedAt) byId.set(p.id, p);
  }
  return [...byId.values()];
}

const remote = [
  { id: 'a', updatedAt: '2026-01-01T00:00:00.000Z', name: 'old' },
  { id: 'b', updatedAt: '2026-02-01T00:00:00.000Z', name: 'only-remote' },
];
const local = [
  { id: 'a', updatedAt: '2026-03-01T00:00:00.000Z', name: 'new' },
  { id: 'c', updatedAt: '2026-02-15T00:00:00.000Z', name: 'only-local' },
];

const merged = mergeByUpdatedAt(remote, local);
assert.strictEqual(merged.length, 3);
assert.strictEqual(merged.find((p) => p.id === 'a')?.name, 'new');
assert.ok(merged.find((p) => p.id === 'b'));
assert.ok(merged.find((p) => p.id === 'c'));

console.log('playlist tests passed');
