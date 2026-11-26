import assert from 'assert';
import { isPendingCloudAttempt, mergeProfilesForSync } from '../lib/sync';
import type { UserProfile } from '../types/database';

assert.ok(isPendingCloudAttempt({ id: 'local-123', user_id: 'demo-user' }));
assert.ok(isPendingCloudAttempt({ id: 'abc', user_id: 'demo-user' }));
assert.ok(!isPendingCloudAttempt({ id: 'uuid-here', user_id: '11111111-1111-1111-1111-111111111111' }));

const local: UserProfile = {
  user_id: 'demo-user',
  display_name: 'Coder',
  rating_band: 1400,
  streak: 4,
  xp: 500,
  last_active_date: '2026-11-25',
};

const remote: UserProfile = {
  user_id: '11111111-1111-1111-1111-111111111111',
  display_name: 'cloud',
  rating_band: 1200,
  streak: 1,
  xp: 100,
  last_active_date: '2026-11-20',
};

const merged = mergeProfilesForSync(local, remote);
assert.strictEqual(merged.user_id, remote.user_id);
assert.strictEqual(merged.xp, 500);
assert.strictEqual(merged.streak, 4);
assert.strictEqual(merged.rating_band, 1400);
assert.strictEqual(merged.last_active_date, '2026-11-25');
assert.strictEqual(merged.display_name, 'cloud');

console.log('sync tests passed');
