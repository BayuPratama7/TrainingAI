# Checklist Kualitas Landing Page

Daftar periksa operasional untuk `portofolio/` dan `welcome-aboard/`.

## Struktur dan konten

- [ ] Halaman berada di folder yang benar (`portofolio/` atau `welcome-aboard/`), bukan di root.
- [ ] Tujuan, audiens, dan CTA utama jelas.
- [ ] Struktur heading logis, tidak ada `h1` ganda.
- [ ] Section memakai landmark semantik (`section`, `article`, `nav`, `main`, `footer`).
- [ ] Tautan anchor valid: setiap `href="#..."` punya `id` tujuan.
  - `portofolio/index.html`: `#main`, `#karya`, `#keahlian`, `#kontak`
  - `welcome-aboard/index.html`: `#orientasi`
- [ ] Aset: `welcome-aboard` memakai `assets/...`; `portofolio` memakai `../welcome-aboard/assets/...`; semua berkas benar-benar ada.
- [ ] Tidak ada folder `assets` duplikat di dalam `portofolio/` maupun di root.
- [ ] Tidak ada `index.html` di root.

## Aksesibilitas

- [ ] Semua kontrol dapat digunakan dengan keyboard.
- [ ] Focus state terlihat (`:focus-visible`) di latar `--bg-base` `#0f131d`.
- [ ] Tombol ikon punya `aria-label` (contoh `.pager__btn`).
- [ ] Gambar informatif punya `alt` tekstual; dekoratif memakai `alt=""`.
- [ ] `.skip-link` pada `portofolio` menuju `#main` dan terlihat saat fokus.
- [ ] `aria-labelledby` menunjuk `id` yang benar-benar ada.
- [ ] Kontras teks memadai; periksa `--text-muted` `#908fa0` dan `--text-dim` `#464554`.
- [ ] Animasi menghormati `prefers-reduced-motion` (`.dot--pulse`, `.glow`).

## Responsivitas dan performa

- [ ] Tidak ada overflow horizontal pada 320px, 768px, dan 1280px (`--shell`).
- [ ] `.cards` dan `.grid` melipat dengan benar pada viewport kecil.
- [ ] Resource eksternal hanya Google Fonts (sudah ada `preconnect`).
- [ ] Tidak ada JavaScript blocking yang tidak diperlukan.
- [ ] Tidak ada inline `style` atau inline `<script>`.

## Node.js dan keamanan

- [ ] `package.json` tanpa `dependencies` / `devDependencies`.
- [ ] `server.mjs` hanya mengimpor `node:*`.
- [ ] Path traversal ditolak `403` di `server.mjs`.
- [ ] Input dari `process.env` divalidasi sebelum dipakai.
- [ ] Tidak ada secret di source atau log.
- [ ] Tidak ada `.env` yang dibuat atau diubah.

## Orkestrasi

- [ ] Setiap `hooks/*.json` punya `hooks/scripts/*.mjs` pasangannya.
- [ ] `hooks/scripts/lib/project.mjs` dipakai bersama, bukan diduplikasi.
- [ ] Frontmatter seluruh `agents/`, `instructions/`, `prompts/`, `skills/` lengkap.
- [ ] Dokumentasi menyebut path nyata proyek ini, bukan placeholder.

## Validasi

- [ ] `node --check` lolos untuk berkas `.mjs` yang diubah.
- [ ] `npm run check:assets` exit 0.
- [ ] `npm run check` exit 0.
- [ ] Bila menyentuh server: `npm start` menyajikan `/` dan `/portofolio/` dengan status `200`.
- [ ] Perubahan dan gap validasi dilaporkan apa adanya.