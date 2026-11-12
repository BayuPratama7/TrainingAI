---
mode: agent
description: "Membangun atau merevisi satu section pada portofolio/index.html atau welcome-aboard/index.html, lengkap dengan CSS dan verifikasi."
---

# Bangun Section Landing Page

Bangun atau revisi section berikut:

> ${input:section:Pilih — #orientasi (welcome-aboard) / #kary a·#keahlian·#kontak (portofolio)}

## Langkah

1. **Baca** berkas halaman dan CSS pasangannya. Catat class yang sudah ada di section tersebut.
2. **Terapkan diff minimal.** Jangan menulis ulang section lain.
3. **Aset.** Gunakan hanya 9 SVG di `welcome-aboard/assets/`:
   `logo`, `icon-arrow-right`, `icon-chevron-left`, `icon-chevron-right`, `icon-cohort`, `icon-craft`, `icon-guild`, `icon-portal`, `icon-track`.
   - `welcome-aboard/index.html` -> `assets/<nama>.svg`
   - `portofolio/index.html` -> `../welcome-aboard/assets/<nama>.svg`
4. **CSS.** Pakai token `:root` (`--bg-base`, `--bg-elevated`, `--text-primary`, `--text-muted`, `--accent-indigo`, `--accent-teal`, `--font-display`, `--font-body`, `--shell`, `--gutter`). Jangan heksadesimal baru.
5. **Aksesibilitas.** Satu `h1` per halaman, `aria-labelledby` menunjuk `id` nyata, tombol ikon punya `aria-label`, gambar dekoratif `alt=""`.
6. **Verifikasi.** Jalankan `npm run check:assets` lalu `npm run check`.

## Peta section

| Halaman | Section | Class kunci |
|---|---|---|
| welcome-aboard | `#orientasi` | `.cards`, `.card`, `.card__head`, `.card__icon`, `.card__tag`, `.card__body`, `.card__title`, `.card__desc` |
| welcome-aboard | hero | `.hero`, `.headline`, `.headline__line`, `.headline__line--gradient`, `.lede` |
| welcome-aboard | actions | `.actions`, `.btn`, `.btn--primary`, `.btn--secondary`, `.btn__label`, `.btn__icon` |
| welcome-aboard | deck nav | `.deck-nav`, `.deck-nav__pager`, `.pager__capsule`, `.pager__controls`, `.pager__btn` |
| portofolio | `#karya` | `.grid`, `.card`, `.card__head`, `.card__icon`, `.card__tag`, `.card__title`, `.card__desc`, `.card__meta` |
| portofolio | `#keahlian` | `.section`, `.section__head`, `.section__title`, `.section__desc` |
| portofolio | `#kontak` | `.section--contact`, `.actions` |

## Larangan

- Jangan membuat `assets/` di `portofolio/`.
- Jangan menyalin atau memindahkan aset.
- Jangan mengubah `Step-Step.docx`.
- Jangan menonaktifkan hook (`--no-verify`).

## Keluaran

Diff ringkas per berkas + output asli `npm run check:assets` dan `npm run check`.