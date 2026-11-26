/**
 * Apply supabase/seed.sql to Postgres in one go.
 *
 * Requires DATABASE_URL in .env (Supabase → Settings → Database → URI).
 * Usage: npm run db:seed
 */
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Client } from 'pg';

config();

function splitStatements(sql: string): string[] {
  const stmts: string[] = [];
  let buf = '';
  let inStr = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    buf += c;
    if (c === "'" && inStr) {
      if (sql[i + 1] === "'") {
        buf += sql[++i];
        continue;
      }
      inStr = false;
      continue;
    }
    if (c === "'" && !inStr) {
      inStr = true;
      continue;
    }
    if (c === ';' && !inStr) {
      const s = buf.trim();
      if (s && s !== ';') stmts.push(s.endsWith(';') ? s : `${s};`);
      buf = '';
    }
  }
  if (buf.trim()) {
    const s = buf.trim();
    stmts.push(s.endsWith(';') ? s : `${s};`);
  }
  return stmts.filter((s) => !s.startsWith('--') || s.includes('\n'));
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error(
      'Missing DATABASE_URL.\n' +
        'Add it to .env from Supabase → Project Settings → Database → Connect → URI\n' +
        'Example: postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres',
    );
    process.exit(1);
  }

  const path = process.argv[2] || 'supabase/seed.sql';
  const sql = readFileSync(path, 'utf8');
  const stmts = splitStatements(sql);
  console.log(`Applying ${path} (${stmts.length} statements)…`);

  const client = new Client({
    connectionString: url,
    ssl: url.includes('localhost') ? undefined : { rejectUnauthorized: false },
  });
  await client.connect();

  const t0 = Date.now();
  try {
    await client.query('begin');
    for (let i = 0; i < stmts.length; i++) {
      await client.query(stmts[i]);
      if ((i + 1) % 100 === 0 || i + 1 === stmts.length) {
        process.stdout.write(`\r  ${i + 1}/${stmts.length}`);
      }
    }
    await client.query('commit');
    console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    await client.query('rollback');
    console.error('\nFailed — rolled back.');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
