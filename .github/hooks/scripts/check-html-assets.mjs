/**
 * Hook PostToolUse — pemeriksaan cepat halaman.
 *
 * Non-blocking: hanya melaporkan lewat `systemMessage` agar pekerjaan
 * tidak terhenti. Untuk validasi ketat gunakan validate-workspace.mjs.
 *
 * Memeriksa:
 *   - referensi aset dengan prefix yang benar dan file yang benar-benar ada
 *   - anchor internal punya `id` tujuan
 *   - tepat satu <h1> per halaman
 */

import { PAGES, rel, validatePage, warn, pass, readHookPayload } from './lib/project.mjs';

// Payload diabaikan: pemeriksaan selalu menyapu kedua halaman.
readHookPayload();

const problems = [];
for (const page of PAGES) {
  problems.push(...validatePage(page));
}

if (problems.length === 0) {
  pass();
  process.exit(0);
}

const report = [
  `Pemeriksaan halaman menemukan ${problems.length} masalah:`,
  ...problems.map((p, i) => `  ${i + 1}. ${p}`),
  '',
  'Perbaiki sebelum melanjutkan. Detail lengkap: npm run check'
].join('\n');

warn(report);
process.exit(0);