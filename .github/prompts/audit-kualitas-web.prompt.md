---
mode: agent
description: "Audit aksesibilitas, responsivitas, SEO dasar, dan performa pada portofolio/index.html dan welcome-aboard/index.html."
---

# Audit Kualitas Web

Audit kedua halaman sebelum review manusia.

## Jalankan dulu

```powershell
npm run check
npm run check:assets
```

Kutip exit code dan output aslinya. Jangan menyimpulkan "lolos" tanpa menjalankannya.

## Periksa — welcome-aboard/index.html

| Aspek | Yang dicek |
|---|---|
| Heading | Tepat satu `.headline` sebagai `h1`; `.card__title` adalah `h2` |
| Anchor | `#orientasi` punya `id` tujuan; tombol primary menuju ke sana |
| A11y | `.pager__btn` punya `aria-label`; `.dot` memakai `aria-hidden="true"` |
| Dekoratif | `.ambient-grid`, `.glow`, semua `<img>` ikon dengan `alt=""` |
| Focus | `.btn`, `.pager__btn` punya `:focus-visible` yang terlihat di `--bg-base` |
| Motion | `.dot--pulse`, `.glow` berhenti saat `prefers-reduced-motion` |
| Navigasi | `.btn--secondary` menuju `../portofolio/index.html` |
| Metadata | `lang="id"`, `title`, `meta[name="description"]` |

## Periksa — portofolio/index.html

| Aspek | Yang dicek |
|---|---|
| Skiplink | `.skip-link` menuju `#main` dan terlihat saat fokus |
| Heading | Satu `#judul-hero` sebagai `h1`; section memakai `h2` |
| Anchor | `#main`, `#karya`, `#keahlian`, `#kontak` lengkap |
| A11y | `.site-nav__list` di dalam `nav` ber-`aria-label`; `aria-labelledby` menunjuk `id` nyata |
| Aset | Semua ikon memakai `../welcome-aboard/assets/...` dan berkasnya ada |
| Grid | `.grid` melipat tanpa overflow di 320px |
| Metadata | `lang="id"`, `title`, `meta[name="description"]` |

## Responsivitas

Uji 320px, 768px, 1280px (`--shell`). Laporkan elemen yang memicu overflow horizontal.

## Kontras

Latar `--bg-base` `#0f131d`. Laporkan pasangan teks yang berisiko:
- `--text-muted` `#908fa0` pada `--bg-tag` `#1c1f2a`
- `--text-dim` `#464554` pada `--bg-base` `#0f131d`

## Keluaran

| # | Severity | Berkas:lokasi | Temuan | Bukti | Rekomendasi |
|---|---|---|---|---|---|

Severity: `Blocker` / `Major` / `Minor`. Sertakan bukti berupa kutipan baris atau output perintah — bukan asumsi.

## Larangan

- Jangan mengedit berkas; ini audit.
- Jangan melaporkan temuan tanpa bukti.