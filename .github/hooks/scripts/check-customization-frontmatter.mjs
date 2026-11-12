/**
 * Hook PostToolUse — validasi frontmatter markdown dan JSON hook.
 *
 * Non-blocking: melaporkan temuan lewat `systemMessage`.
 *
 * Memeriksa:
 *   - setiap *.md di .github/ yang berperan sebagai agent/prompt/instruction/skill
 *     memiliki frontmatter YAML dan field wajibnya
 *   - setiap *.json di .github/hooks/ valid JSON dan memiliki kunci "hooks"
 */

import path from 'node:path';
import { GH, walk, rel, readText, warn, pass, readHookPayload } from './lib/project.mjs';

readHookPayload();

const problems = [];
const files = walk(GH);

/** Ambil blok frontmatter `--- ... ---` di awal file. */
function readFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const body = text.slice(3, end).trim();
  const data = {};
  for (const line of body.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim());
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return data;
}

/** Field wajib per jenis artefak. */
const REQUIRED = {
  '.agent.md': ['name', 'description'],
  '.prompt.md': ['description'],
  '.instructions.md': ['description', 'applyTo'],
  'SKILL.md': ['name', 'description']
};

for (const file of files) {
  const name = path.basename(file);
  const type = Object.keys(REQUIRED).find((suffix) => name.endsWith(suffix));
  if (!type) continue;

  const text = readText(file);
  if (text === null) {
    problems.push(`${rel(file)}: tidak dapat dibaca`);
    continue;
  }

  const fm = readFrontmatter(text);
  if (!fm) {
    problems.push(`${rel(file)}: frontmatter YAML tidak ditemukan (wajib diawali "---")`);
    continue;
  }

  for (const key of REQUIRED[type]) {
    if (!fm[key] || fm[key].trim() === '') {
      problems.push(`${rel(file)}: field frontmatter "${key}" kosong atau hilang`);
    }
  }
}

// JSON hook
for (const file of files.filter((f) => f.endsWith('.json'))) {
  const text = readText(file);
  if (text === null) {
    problems.push(`${rel(file)}: tidak dapat dibaca`);
    continue;
  }
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !data.hooks) {
      problems.push(`${rel(file)}: tidak memiliki kunci "hooks"`);
    }
  } catch (err) {
    problems.push(`${rel(file)}: JSON tidak valid -> ${err.message}`);
  }
}

if (problems.length === 0) {
  pass();
  process.exit(0);
}

warn(
  [
    `Validasi customization menemukan ${problems.length} masalah:`,
    ...problems.map((p, i) => `  ${i + 1}. ${p}`)
  ].join('\n')
);
process.exit(0);