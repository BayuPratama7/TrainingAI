---
mode: agent
description: "Menyusun rencana dan acceptance criteria untuk portofolio/index.html atau welcome-aboard/index.html sebelum coding."
---

# Rancang Landing Page

Susun rencana teknis untuk pekerjaan berikut:

> ${input:tujuan:Contoh — tambah section "Sertifikasi" di portofolio, atau perbaiki layout kartu di welcome-aboard}

## Baca dulu

1. `welcome-aboard/index.html` + `welcome-aboard/styles.css`
2. `portofolio/index.html` + `portofolio/styles.css`
3. `.github/hooks/scripts/lib/project.mjs` (daftar aset wajib, prefix per halaman)

## Yang harus dijawab

| Hal | Isi |
|---|---|
| Halaman sasaran | `welcome-aboard/` dan/atau `portofolio/` |
| Section / anchor | `#orientasi` \| `#main` \| `#karya` \| `#keahlian` \| `#kontak` |
| Class yang dipakai | sebutkan class nyata dari CSS |
| Aset terdampak | dari 9 SVG di `welcome-aboard/assets/` |
| Token CSS | dari `:root` di kedua stylesheet |

## Acceptance criteria

Tulis kriteria yang **bisa diverifikasi perintah**, bukan opini. Contoh bentuk:

- `[ ] npm run check` exit 0
- `[ ] npm run check:assets` exit 0
- `[ ] Tidak ada `<h1>` kedua di <halaman>`
- `[ ] Anchor <#id> masih punya id tujuan`
- `[ ] Tidak ada overflow horizontal di 320px`

## Aturan

- Jangan mengubah berkas apa pun pada tahap ini.
- Jangan mengusulkan dependensi npm.
- Jangan mengusulkan `assets/` baru; aset hanya di `welcome-aboard/assets/`.
- Jika kebutuhan ambigu, tulis pertanyaan terbuka.

## Keluaran

Rencana ringkas: halaman, section, daftar perubahan per berkas, acceptance criteria, risiko.