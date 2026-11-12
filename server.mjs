/**
 * Server statis untuk proyek Training AI (portofolio + welcome-aboard).
 *
 * Tanpa dependensi eksternal — hanya API bawaan Node.js.
 *
 *   npm start        -> http://localhost:3000/
 *   PORT=8080 npm start
 *
 * Rute:
 *   /                        -> welcome-aboard/index.html
 *   /welcome-aboard/         -> welcome-aboard/index.html
 *   /portofolio/             -> portofolio/index.html
 *   /welcome-aboard/assets/* -> aset SVG bersama
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

/** Kirim respons teks sederhana. */
function sendText(res, status, body, headers = {}) {
  const payload = Buffer.from(body, 'utf8');
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': payload.length,
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(payload);
}

/**
 * Petakan URL menjadi path absolut di dalam ROOT.
 * Mengembalikan null bila path keluar dari ROOT (path traversal).
 */
function resolveSafe(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.posix.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const abs = path.resolve(ROOT, `.${normalized}`);
  const rootWithSep = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (abs !== ROOT && !abs.startsWith(rootWithSep)) return null;
  return abs;
}

/** Cek apakah file ada dan bertipe file biasa. */
async function isFile(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    sendText(res, 405, 'Metode tidak diizinkan', { Allow: 'GET, HEAD' });
    return;
  }

  const urlPath = (req.url || '/').split('?')[0];

  // Root -> halaman orientasi.
  if (urlPath === '/' || urlPath === '') {
    res.writeHead(302, { Location: '/welcome-aboard/' });
    res.end();
    return;
  }

  // Folder tanpa trailing slash -> tambahkan slash agar path relatif benar.
  const knownDirs = ['/welcome-aboard', '/portofolio'];
  if (knownDirs.includes(urlPath)) {
    res.writeHead(301, { Location: `${urlPath}/` });
    res.end();
    return;
  }

  let target = resolveSafe(urlPath);
  if (target === null) {
    sendText(res, 403, 'Akses ditolak');
    return;
  }

  // Direktori -> index.html
  try {
    const s = await stat(target);
    if (s.isDirectory()) target = path.join(target, 'index.html');
  } catch {
    // biarkan pemeriksaan isFile di bawah menangani 404
  }

  if (!(await isFile(target))) {
    sendText(res, 404, `404 — Tidak ditemukan: ${urlPath}`);
    return;
  }

  try {
    const body = await readFile(target);
    const type = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': body.length,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    if (method === 'HEAD') res.end();
    else res.end(body);
  } catch {
    sendText(res, 500, 'Gagal membaca file');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} sudah dipakai.`);
    console.error(`Coba port lain:  $env:PORT=3001; npm start\n`);
  } else if (err.code === 'EACCES') {
    console.error(`\nIzin ditolak untuk port ${PORT}. Gunakan port > 1024.\n`);
  } else {
    console.error('\nServer gagal dijalankan:', err.message, '\n');
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('Server berjalan:');
  console.log(`  Welcome Aboard : http://localhost:${PORT}/`);
  console.log(`  Portofolio     : http://localhost:${PORT}/portofolio/`);
  console.log('');
  console.log('Tekan Ctrl+C untuk menghentikan.');
  console.log('');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}