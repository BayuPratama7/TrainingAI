/**
 * Utilitas bersama untuk seluruh hook `.github/hooks/scripts`.
 *
 * Semua path di-resolve dari ROOT proyek (dua level di atas file ini),
 * sehingga script dapat dipanggil dari direktori kerja mana pun:
 *   node .github/hooks/scripts/check-html-assets.mjs
 *
 * Tanpa dependensi eksternal. Hanya API bawaan Node.js.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** Root proyek = dua direktori di atas `scripts/`. */
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..', // scripts/
  '..', // hooks/
  '..', // .github/
  '..'  // root proyek
);

/** Root folder orkestrasi. */
export const GH = path.join(ROOT, '.github');

/** Halaman yang menjadi sasaran seluruh orkestrasi. */
export const PAGES = [
  { key: 'welcome-aboard', file: path.join(ROOT, 'welcome-aboard', 'index.html'), assetPrefix: 'assets/' },
  { key: 'portofolio', file: path.join(ROOT, 'portofolio', 'index.html'), assetPrefix: '../welcome-aboard/assets/' }
];

/** Satu-satunya folder aset yang diizinkan di seluruh repo. */
export const ASSET_DIR = path.join(ROOT, 'welcome-aboard', 'assets');

/** Sembilan aset yang wajib ada. */
export const REQUIRED_ASSETS = [
  'logo.svg',
  'icon-arrow-right.svg',
  'icon-chevron-left.svg',
  'icon-chevron-right.svg',
  'icon-cohort.svg',
  'icon-craft.svg',
  'icon-guild.svg',
  'icon-portal.svg',
  'icon-track.svg'
];

/** Struktur folder `.github` yang wajib ada dan wajib terisi. */
export const GITHUB_DIRS = ['agents', 'hooks', 'instructions', 'prompts', 'skills'];

/** Pasangan hook JSON -> script implementasi. */
export const HOOK_PAIRS = [
  { json: 'inject-project-context.json', script: 'inject-project-context.mjs' },
  { json: 'guard-env-files.json', script: 'guard-env-files.mjs' },
  { json: 'guard-env-commit.json', script: 'guard-env-commit.mjs' },
  { json: 'guard-dangerous-commands.json', script: 'guard-dangerous-commands.mjs' },
  { json: 'check-html-assets.json', script: 'check-html-assets.mjs' },
  { json: 'check-customization-frontmatter.json', script: 'check-customization-frontmatter.mjs' },
  { json: 'validate-workspace.json', script: 'validate-workspace.mjs' }
];

/** Ekstensi yang dianggap aset statis. */
export const ASSET_EXT = /\.(svg|png|jpe?g|webp|gif|ico|avif|woff2?)$/i;

/**
 * Baca payload hook dari stdin.
 *
 * PENTING: `readFileSync(0)` memblokir selamanya bila stdin adalah terminal
 * interaktif (tidak ada EOF). Karena itu stdin hanya dibaca ketika memang
 * berupa pipe/file. Saat dipanggil manual dari terminal, fungsi langsung
 * mengembalikan { } agar script tidak menggantung.
 *
 * Mengembalikan { } bila stdin kosong atau bukan JSON yang valid,
 * sehingga script tidak pernah crash.
 */
export function readHookPayload() {
  // Terminal interaktif -> tidak ada payload untuk dibaca.
  if (process.stdin.isTTY) return {};

  try {
    const raw = readFileSync(0, 'utf8').trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** Cetak keputusan hook ke stdout sebagai JSON. */
export function emit(decision) {
  process.stdout.write(`${JSON.stringify(decision)}\n`);
}

/** Tolak aksi dengan alasan yang jelas (blocking). */
export function deny(reason) {
  emit({
    permissionDecision: 'deny',
    permissionDecisionReason: reason
  });
}

/** Izinkan aksi secara eksplisit. */
export function allow() {
  emit({ permissionDecision: 'allow' });
}

/** Laporan non-blocking untuk hook PostToolUse. */
export function warn(message) {
  emit({ systemMessage: message });
}

/** Lolos tanpa pesan. */
export function pass() {
  emit({});
}

/** Ambil semua file di dalam sebuah direktori, rekursif. */
export function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Path relatif terhadap root, dengan separator seragam `/`. */
export function rel(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join('/');
}

/** Baca file sebagai teks; kembalikan null bila gagal. */
export function readText(absPath) {
  try {
    return readFileSync(absPath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Ekstrak path aset dari sebuah dokumen HTML.
 * Menangkap `src` dan `href` yang berakhiran ekstensi aset,
 * mengabaikan URL absolut, data URI, dan anchor.
 */
export function extractAssetRefs(html) {
  const refs = [];
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const value = m[1].trim();
    if (!value) continue;
    if (/^(?:[a-z]+:)?\/\//i.test(value)) continue; // http(s)://, //
    if (value.startsWith('data:')) continue;
    if (value.startsWith('#')) continue;
    if (value.startsWith('mailto:')) continue;
    if (value.startsWith('tel:')) continue;
    if (!ASSET_EXT.test(value.split('?')[0])) continue;
    refs.push(value.split('?')[0]);
  }
  return refs;
}

/**
 * Validasi satu halaman: aset, anchor, dan jumlah h1.
 * Mengembalikan array masalah (string). Kosong berarti lolos.
 */
export function validatePage(page) {
  const problems = [];
  const html = readText(page.file);
  if (html === null) {
    return [`${rel(page.file)} tidak dapat dibaca`];
  }

  const dir = path.dirname(page.file);

  // 1. Referensi aset harus mengikuti prefix yang benar dan filenya ada.
  for (const ref of extractAssetRefs(html)) {
    const isLocal = !ref.startsWith('..');
    const expected = page.assetPrefix;
    if (isLocal && !ref.startsWith(expected)) {
      problems.push(
        `${rel(page.file)}: "${ref}" seharusnya memakai prefix "${expected}"`
      );
    }
    const target = path.resolve(dir, ref);
    if (!existsSync(target)) {
      problems.push(`${rel(page.file)}: aset tidak ditemukan -> "${ref}"`);
    }
  }

  // 2. Setiap href="#..." harus punya id tujuan di halaman yang sama.
  const anchors = [...html.matchAll(/href\s*=\s*["']#([A-Za-z0-9_-]+)["']/g)].map((m) => m[1]);
  const ids = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]));
  for (const anchor of new Set(anchors)) {
    if (!ids.has(anchor)) {
      problems.push(`${rel(page.file)}: anchor "#${anchor}" tanpa id tujuan`);
    }
  }

  // 3. Tepat satu <h1>.
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) {
    problems.push(`${rel(page.file)}: jumlah <h1> = ${h1}, seharusnya 1`);
  }

  return problems;
}

/** Ambil string perintah dari payload hook untuk guard PreToolUse. */
export function extractCommand(payload) {
  const candidates = [
    payload?.tool_input?.command,
    payload?.toolInput?.command,
    payload?.input?.command,
    payload?.command
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }
  return '';
}

/** Ambil path target dari payload hook (tool edit/write/terminal). */
export function extractPaths(payload) {
  const out = new Set();
  const push = (v) => {
    if (typeof v === 'string' && v.trim()) out.add(v.trim());
  };
  const input = payload?.tool_input ?? payload?.toolInput ?? payload?.input ?? {};

  push(input.file_path);
  push(input.filePath);
  push(input.path);
  push(input.target_file);
  push(input.uri);

  if (Array.isArray(input.file_paths)) input.file_paths.forEach(push);
  if (Array.isArray(input.paths)) input.paths.forEach(push);

  return [...out];
}