/**
 * Hook PreToolUse — mencegah `.env` atau nilai menyerupai secret ikut di-commit.
 *
 * Memeriksa perintah `git add` / `git commit` pada seluruh proyek.
 */

import { readHookPayload, extractCommand, deny, pass } from './lib/project.mjs';

const payload = readHookPayload();
const command = extractCommand(payload);

if (!command) {
  pass();
  process.exit(0);
}

const isGitWrite = /\bgit\s+(commit|add|push)\b/i.test(command);
if (!isGitWrite) {
  pass();
  process.exit(0);
}

// 1. Jangan pernah commit berkas .env.
const stageEnv = /\bgit\s+add\b[\s\S]*\.env(\s|$|["'])/i.test(command);
const allEnv = /\bgit\s+add\b[\s\S]*?(?:-A|--all|\.)(\s|$)/i.test(command);

if (stageEnv) {
  deny(
    'Ditolak: `git add` menyertakan berkas .env. ' +
      'Keluarkan berkas environment dari staging sebelum commit.'
  );
  process.exit(0);
}

if (allEnv && /\bgit\s+commit\b/i.test(command)) {
  deny(
    'Ditolak: `git add -A` / `git add .` berisiko menyertakan .env dan berkas sensitif lain. ' +
      'Stage berkas secara eksplisit: mis. `git add welcome-aboard/index.html portofolio/index.html`.'
  );
  process.exit(0);
}

// 2. Deteksi secret yang ditulis langsung pada pesan commit.
const secretPatterns = [
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: 'Private key block', re: /-----BEGIN\s+(?:RSA|OPENSSH|EC|PGP)\s+PRIVATE KEY-----/ },
  { name: 'Generic bearer', re: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ }
];

for (const { name, re } of secretPatterns) {
  if (re.test(command)) {
    deny(
      `Ditolak: perintah commit mengandung nilai yang menyerupai secret (${name}). ` +
        'Hapus nilai tersebut dari pesan atau perintah sebelum melanjutkan.'
    );
    process.exit(0);
  }
}

pass();