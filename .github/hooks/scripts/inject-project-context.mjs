/**
 * Hook SessionStart — menyuntikkan konteks proyek.
 *
 * Tujuan: setiap sesi baru langsung tahu struktur root yang dijaga,
 * dua halaman sasaran, dan aturan path aset yang berlaku.
 */

import { ROOT, PAGES, ASSET_DIR, REQUIRED_ASSETS, rel, pass, warn, readText } from './lib/project.mjs';

const lines = [
  '## Konteks Proyek Training AI',
  '',
  'Struktur root yang dijaga (hanya 4 entri):',
  '  .github/  portofolio/  welcome-aboard/  Step-Step.docx',
  '',
  'Halaman sasaran:'
];

for (const page of PAGES) {
  const exists = readText(page.file) !== null;
  lines.push(`  - ${rel(page.file)} ${exists ? '(ada)' : '(TIDAK ADA)'} -> prefix aset "${page.assetPrefix}"`);
}

lines.push('');
lines.push('Aturan aset: hanya SATU folder assets, yaitu welcome-aboard/assets/.');
lines.push('  - welcome-aboard/index.html  -> assets/<nama>.svg');
lines.push('  - portofolio/index.html      -> ../welcome-aboard/assets/<nama>.svg');
lines.push('');
lines.push(`Aset wajib (${REQUIRED_ASSETS.length}): ${REQUIRED_ASSETS.join(', ')}`);
lines.push('');
lines.push(`Root proyek: ${ROOT}`);
lines.push(`Folder aset: ${rel(ASSET_DIR)}`);
lines.push('');
lines.push('Runtime: server.mjs (node:http, nol dependensi). Jalankan: npm start');
lines.push('Validasi: npm run check  |  npm run check:assets');

const message = lines.join('\n');

// SessionStart: tidak ada keputusan izin, cukup konteks.
warn(message);
process.exit(0);