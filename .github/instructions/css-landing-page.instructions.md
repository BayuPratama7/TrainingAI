---
name: "Aturan CSS Landing Page"
description: "Gunakan saat mengubah welcome-aboard/styles.css atau portofolio/styles.css: design token, mobile-first, focus state, reduced motion, dan konsistensi visual."
applyTo: "**/*.css"
---

# Aturan CSS Landing Page

Berlaku untuk `welcome-aboard/styles.css` (743 baris) dan `portofolio/styles.css` (698 baris).

## Design token — pakai, jangan duplikasi

Kedua stylesheet memakai token yang sama di `:root`:

```css
/* Surfaces */
--bg-base: #0f131d;      --bg-elevated: #171b26;
--bg-chip: #262a35;      --bg-tag: #1c1f2a;

/* Text */
--text-primary: #dfe2f1;  --text-secondary: #c7c4d7;
--text-muted: #908fa0;    --text-dim: #464554;

/* Accents */
--accent-indigo: #8083ff; --accent-lilac: #c0c1ff; --accent-teal: #4fdbc8;

/* Fonts */
--font-display: "Plus Jakarta Sans", ...;
--font-body: "Inter", ...;
--font-mono: "JetBrains Mono", ...;

/* Layout */
--shell: 1280px; --gutter: 24px;
```

- Jangan menulis heksadesimal baru bila token setara sudah ada.
- Jika butuh nilai baru, tambahkan sebagai token di `:root`, jangan sebagai magic number tersebar.
- Jaga kedua stylesheet tetap konsisten untuk nilai yang sama (warna, radius, durasi transisi).

## Layout

- Mobile-first: gaya dasar untuk layar kecil, lalu `@media (min-width: ...)` untuk layar besar.
- Hormati `--shell` (1280px) dan `--gutter` (24px) sebagai batas konten.
- Pastikan `.cards` (`welcome-aboard`) dan `.grid` (`portofolio`) melipat tanpa overflow horizontal di 320px.

## Focus state

- Jangan menghapus `outline` tanpa pengganti.
- Gunakan `:focus-visible` dengan `outline` yang kontras terhadap `--bg-base`.
- Berlaku untuk `.btn`, `.site-nav__list a`, `.site-nav__back`, `.pager__btn`, `.skip-link`.

## Motion

- Pertahankan blok `@media (prefers-reduced-motion: reduce)`.
- Animasi yang harus dinonaktifkan: `.dot--pulse`, `.glow`, transisi `.btn`, dan transform hover kartu.
- Jangan menambah animasi yang berjalan terus-menerus tanpa alasan fungsional.

## Struktur berkas

- Kelompokkan per bagian dengan komentar pembatas yang sudah dipakai (`/* ---- Reset ---- */`, `/* ---- Layout ---- */`, dst.).
- Jangan memindahkan urutan bagian tanpa alasan; cascade bergantung padanya.
- Hindari `!important` kecuali untuk override utilitas yang memang disengaja.

## Larangan

- Menambah framework CSS (Tailwind, Bootstrap) atau preprocessor.
- Memakai `@import` untuk resource eksternal baru; font sudah dimuat lewat `<link>` di HTML.
- Inline style di HTML.

## Setelah perubahan

1. Periksa tidak ada overflow horizontal di 320px.
2. Periksa focus ring terlihat di latar gelap.
3. Jalankan `npm run check`.