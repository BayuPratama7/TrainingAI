---
name: "Aturan Node.js Landing Page"
description: "Gunakan saat mengubah server.mjs, .github/hooks/scripts/*.mjs, atau package.json: API standar Node.js, nol dependensi, validasi input, dan penanganan error eksplisit."
applyTo: "**/*.mjs,**/*.cjs,**/package.json"
---

# Aturan Node.js Landing Page

Berlaku untuk `server.mjs`, `.github/hooks/scripts/**/*.mjs`, dan `package.json`.

## Prinsip: nol dependensi

Proyek ini tidak memiliki `node_modules` dan tidak boleh memilikinya.

- Hanya API bawaan: `node:fs`, `node:fs/promises`, `node:path`, `node:http`, `node:process`, `node:url`, `node:readline`.
- Jangan menambah `dependencies` atau `devDependencies` ke `package.json`.
- Jangan memakai `require`; proyek memakai ESM (`"type": "module"`, `import`).
- Jangan memanggil Python, PowerShell, atau binary eksternal sebagai runtime.

## Server (`server.mjs`)

- Port dari `process.env.PORT`, default `3000`. Host default `127.0.0.1`.
- Sajikan dari root proyek; dua halaman sasaran tetap terjangkau.
- Rute: `/` -> `welcome-aboard/`, `/portofolio/`, `/welcome-aboard/`.
- Path traversal **wajib** ditolak: resolve path, pastikan masih di dalam root, kembalikan `403` bila keluar.
- MIME type eksplisit untuk `html`, `css`, `js`, `mjs`, `json`, `svg`, `png`, `jpg`, `jpeg`, `webp`, `gif`, `ico`, `avif`, `woff`, `woff2`.
- Tangani `GET` dan `HEAD`. Metode lain -> `405` dengan header `Allow`.
- Tangani `EADDRINUSE` dan `EACCES` dengan pesan yang bisa ditindaklanjuti, bukan stack trace.
- Kirim header `X-Content-Type-Options: nosniff`.
- Jangan pernah menampilkan isi berkas di luar root proyek.

## Hook scripts (`.github/hooks/scripts/`)

- Setiap script membaca payload dari **stdin** sebagai JSON; harus tahan terhadap stdin kosong (gunakan `readHookPayload()` dari `lib/project.mjs`).
- Guard `PreToolUse` memakai `permissionDecision: "deny"` disertai `permissionDecisionReason` yang menjelaskan cara memperbaiki.
- `PostToolUse` hanya melapor lewat `systemMessage`; jangan memblokir.
- `Stop` keluar dengan kode `1` bila ada pelanggaran, `0` bila lolos.
- Gunakan konstanta bersama dari `lib/project.mjs` (`ROOT`, `PAGES`, `ASSET_DIR`, `REQUIRED_ASSETS`, `GITHUB_DIRS`, `HOOK_PAIRS`, `validatePage`). **Jangan** menduplikasi daftar path atau nama aset di script lain.
- Semua path di-resolve dari `ROOT`, bukan dari `process.cwd()`.

## Validasi input

- Nilai dari `process.env` divalidasi sebelum dipakai (`Number.isFinite`, batas rentang).
- Payload hook dianggap tidak tepercaya: periksa tipe sebelum diakses.
- Jangan mengeksekusi string dari payload sebagai perintah.

## Penanganan error

- Bungkus operasi I/O dengan `try/catch`; jangan biarkan `unhandledRejection` mematikan hook.
- Pesan error harus menyebut berkas atau nilai yang bermasalah.
- Jangan menelan error lalu melaporkan sukses.

## Keamanan

- Jangan menulis secret ke source, log, atau keluaran hook.
- Jangan membuat atau mengubah berkas `.env` dari sesi agent.
- Jangan menonaktifkan validasi dengan `--no-verify`.

## Sebelum menyatakan selesai

1. `node --check <berkas>.mjs` untuk sintaks.
2. `npm run check` (validasi penuh).
3. `npm run check:assets`.
4. Jika menyentuh server: `npm start` lalu uji status HTTP `200` pada `/`, `/portofolio/`, dan `/welcome-aboard/assets/logo.svg`.