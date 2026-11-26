import assert from 'assert';
import { FIGURE_ASSETS } from '../lib/figures';
import {
  plainStatement,
  statementHasFigures,
  statementToHtml,
} from '../lib/statementRender';

assert.ok(FIGURE_ASSETS['binary-trees']);
assert.ok(FIGURE_ASSETS['spiral-grid']);
assert.ok(FIGURE_ASSETS['hex-hive']);

const withFigure = 'See [[figure:binary-trees]] for the four trees.';
assert.ok(statementHasFigures(withFigure));
const html = statementToHtml(withFigure);
assert.ok(html.includes('<svg'));
assert.ok(html.includes('binary') || html.includes('Four') || html.includes('>A<'));

const grid = 'Grid:\n\n```grid\n1 2 3\n4 5 6\n```\n';
const gridHtml = statementToHtml(grid);
assert.ok(gridHtml.includes('<pre class="grid">'));
assert.ok(gridHtml.includes('1 2 3'));
assert.ok(!gridHtml.includes('```'));

const img = '![Hive](asset:hex-hive)';
const imgHtml = statementToHtml(img);
assert.ok(imgHtml.includes('<svg'));

const plain = plainStatement('Cost is $O(N)$ [[figure:spiral-grid]]');
assert.ok(plain.includes('O(N)'));
assert.ok(plain.includes('[figure:'));
assert.ok(!plain.includes('[[figure'));

const remote = statementToHtml('![x](https://example.com/a.png)');
assert.ok(remote.includes('src="https://example.com/a.png"'));

console.log('statement-render tests passed');
