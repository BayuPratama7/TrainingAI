#!/usr/bin/env node
/**
 * Hook Stop — validasi penuh workspace.
 *
 * Bersifat BLOCKING: keluar dengan kode 1 bila ada pelanggaran,
 * sehingga sesi tidak bisa dinyatakan selesai dengan klaim palsu.
 *
 * Yang divalidasi:
 *   1. Struktur root hanya 4 entri utama
 *   2. Kelima subfolder .github/ ada dan tidak kosong
 *   3. Setiap hooks/*.json punya hooks/scripts/*.mjs pasangannya
 *   4. hooks/scripts/lib/project.mjs ada
 *   5. Hanya ada satu folder `assets` di seluruh repo (welcome-aboard/assets)
 *   6. Sembilan aset wajib ada
 *   7. Dua halaman: aset valid, anchor valid, tepat satu h1
 *   8. package.json tanpa dependencies dan script npm wajib
 *   9. server.mjs ada dan hanya memakai node: bawaan
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  GH,
  PAGES,
  ASSET_DIR,
  REQUIRED_ASSETS,
  GITHUB_DIRS,
  HOOK_PAIRS,
  rel,
  readText,
  validatePage
} from './lib/project.mjs';

const errors = [];
const warnings = [];
const checks = [];

function ok(label) {
  checks.push(`  OK   ${label}`);
}

function fail(label, detail) {
  checks.push(`  FAIL ${label}`);
  errors.push(detail ? `${label} -> ${detail}` : label);
}

// --------------------------------------------------------------------------
// 1. Struktur root
// --------------------------------------------------------------------------

const ALLOWED_ROOT = new Set([
  '.github',
  '.git',
  '.gitignore',
  'portofolio',
  'welcome-aboard',
  'Step-Step.docx',
  'package.json',
  'server.mjs',
  'PROMPT.md',
  'README.md',
  'node_modules'
]);

let rootEntries = [];
try {
  rootEntries = readdirSync(ROOT);
} catch (err) {
  fail('Root dapat dibaca', err.message);
}

const stray = rootEntries.filter((e) => !ALLOWED_ROOT.has(e));
if (stray.length === 0) ok('Root tidak memuat entri liar');
else fail('Root tidak memuat entri liar', `ditemukan: ${stray.join(', ')}`);

// --------------------------------------------------------------------------
// 2. Subfolder .github
// --------------------------------------------------------------------------

for (const dir of GITHUB_DIRS) {
  const full = path.join(GH, dir);
  if (!existsSync(full)) {
    fail(`.github/${dir}/ ada`, 'folder tidak ditemukan');
    continue;
  }
  const entries = readdirSync(full, { recursive: true }).filter((e) => {
    try {
      return statSync(path.join(full, e)).isFile();
    } catch {
      return false;
    }
  });
  if (entries.length === 0) fail(`.github/${dir}/ terisi`, 'folder kosong');
  else ok(`.github/${dir}/ terisi (${entries.length} file)`);
}

// copilot-instructions.md wajib di dalam .github/
if (existsSync(path.join(GH, 'copilot-instructions.md'))) {
  ok('.github/copilot-instructions.md ada');
} else {
  fail('.github/copilot-instructions.md ada', 'file tidak ditemukan');
}

// README.md boleh di root (tampil di halaman depan GitHub) atau di .github/
if (existsSync(path.join(ROOT, 'README.md'))) {
  ok('README.md ada (root)');
} else if (existsSync(path.join(GH, 'README.md'))) {
  ok('README.md ada (.github/)');
} else {
  fail('README.md ada', 'tidak ditemukan di root maupun .github/');
}

// --------------------------------------------------------------------------
// 3 & 4. Pasangan hook + lib
// --------------------------------------------------------------------------

const scriptsDir = path.join(GH, 'hooks', 'scripts');
if (existsSync(path.join(scriptsDir, 'lib', 'project.mjs'))) {
  ok('hooks/scripts/lib/project.mjs ada');
} else {
  fail('hooks/scripts/lib/project.mjs ada', 'file tidak ditemukan');
}

for (const { json, script } of HOOK_PAIRS) {
  const jsonPath = path.join(GH, 'hooks', json);
  const scriptPath = path.join(scriptsDir, script);
  const hasJson = existsSync(jsonPath);
  const hasScript = existsSync(scriptPath);

  if (!hasJson) fail(`hooks/${json} ada`, 'JSON tidak ditemukan');
  if (!hasScript) fail(`hooks/scripts/${script} ada`, 'script tidak ditemukan');

  if (hasJson) {
    try {
      const data = JSON.parse(readText(jsonPath) ?? '{}');
      if (!data.hooks || typeof data.hooks !== 'object') {
        fail(`hooks/${json} valid`, 'tidak memiliki kunci "hooks"');
      } else {
        // Pastikan JSON benar-benar menunjuk ke script yang ada.
        const raw = readText(jsonPath) ?? '';
        if (!raw.includes(script)) {
          fail(`hooks/${json} menunjuk ${script}`, 'nama script tidak tercantum');
        } else {
          ok(`hooks/${json} <-> scripts/${script}`);
        }
      }
    } catch (err) {
      fail(`hooks/${json} valid`, err.message);
    }
  }
}

// --------------------------------------------------------------------------
// 5. Satu folder assets
// --------------------------------------------------------------------------

function findAssetDirs(dir, found = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.name === 'assets') found.push(full);
    findAssetDirs(full, found);
  }
  return found;
}

const assetDirs = findAssetDirs(ROOT);
if (assetDirs.length === 1 && path.resolve(assetDirs[0]) === path.resolve(ASSET_DIR)) {
  ok('Hanya satu folder assets: welcome-aboard/assets/');
} else if (assetDirs.length === 0) {
  fail('Hanya satu folder assets', 'tidak ada folder assets sama sekali');
} else {
  fail('Hanya satu folder assets', `ditemukan ${assetDirs.length}: ${assetDirs.map(rel).join(', ')}`);
}

// --------------------------------------------------------------------------
// 6. Aset wajib
// --------------------------------------------------------------------------

const missingAssets = REQUIRED_ASSETS.filter((a) => !existsSync(path.join(ASSET_DIR, a)));
if (missingAssets.length === 0) ok(`Sembilan aset wajib lengkap (${REQUIRED_ASSETS.length})`);
else fail('Sembilan aset wajib lengkap', `hilang: ${missingAssets.join(', ')}`);

// --------------------------------------------------------------------------
// 7. Dua halaman
// --------------------------------------------------------------------------

for (const page of PAGES) {
  if (!existsSync(page.file)) {
    fail(`${rel(page.file)} ada`, 'halaman tidak ditemukan');
    continue;
  }
  const problems = validatePage(page);
  if (problems.length === 0) ok(`${rel(page.file)}: aset, anchor, h1 valid`);
  else fail(`${rel(page.file)} valid`, problems.join('; '));
}

// --------------------------------------------------------------------------
// 8. package.json
// --------------------------------------------------------------------------

const pkgPath = path.join(ROOT, 'package.json');
if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readText(pkgPath) ?? '{}');
    if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
      fail('package.json tanpa dependencies', `ditemukan: ${Object.keys(pkg.dependencies).join(', ')}`);
    } else {
      ok('package.json tanpa dependencies');
    }

    const requiredScripts = ['start', 'check', 'check:assets'];
    const missing = requiredScripts.filter((s) => !pkg.scripts || !pkg.scripts[s]);
    if (missing.length === 0) ok('Script npm wajib tersedia (start, check, check:assets)');
    else fail('Script npm wajib tersedia', `hilang: ${missing.join(', ')}`);
  } catch (err) {
    fail('package.json valid', err.message);
  }
} else {
  fail('package.json ada', 'file tidak ditemukan');
}

// --------------------------------------------------------------------------
// 9. server.mjs
// --------------------------------------------------------------------------

const serverPath = path.join(ROOT, 'server.mjs');
if (!existsSync(serverPath)) {
  fail('server.mjs ada', 'file tidak ditemukan');
} else {
  const src = readText(serverPath) ?? '';
  if (!/from\s+['"]node:/.test(src)) {
    fail('server.mjs memakai API bawaan Node.js', 'tidak ada import node:*');
  } else if (/from\s+['"](?!node:)[a-z@][^'"]*['"]/.test(src)) {
    fail('server.mjs tanpa dependensi eksternal', 'terdapat import non-node:');
  } else {
    ok('server.mjs hanya memakai API bawaan Node.js');
  }

  if (/python|py\s+-m\s+http\.server/i.test(src)) {
    fail('server.mjs tidak memanggil Python', 'terdeteksi referensi Python');
  }
}

// Peringatan: script hook tidak boleh memanggil python.
for (const file of readdirSync(scriptsDir, { recursive: true })) {
  const full = path.join(scriptsDir, file);
  try {
    if (!statSync(full).isFile()) continue;
  } catch {
    continue;
  }
  if (!full.endsWith('.mjs')) continue;
  const src = readText(full) ?? '';
  if (/spawn\w*\(\s*['"](?:python|py)['"]/.test(src)) {
    warnings.push(`${rel(full)} memanggil Python sebagai runtime`);
  }
}

// --------------------------------------------------------------------------
// Laporan
// --------------------------------------------------------------------------

const runtime = `Node ${process.version}`;
console.log('');
console.log('Validasi workspace Training AI');
console.log('==================================================');
console.log(runtime);
console.log('');
console.log('Pemeriksaan:');
for (const line of checks) console.log(line);

if (warnings.length > 0) {
  console.log('');
  console.log('Peringatan:');
  for (const w of warnings) console.log(`  WARN ${w}`);
}

console.log('');
if (errors.length === 0) {
  console.log(`HASIL: LOLOS — ${checks.length} pemeriksaan, 0 pelanggaran.`);
  console.log('');
  process.exit(0);
} else {
  console.log(`HASIL: GAGAL — ${errors.length} pelanggaran:`);
  for (const e of errors) console.log(`  - ${e}`);
  console.log('');
  process.exit(1);
}