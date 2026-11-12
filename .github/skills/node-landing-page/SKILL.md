---
name: node-landing-page
description: "Workflow end-to-end untuk membangun, memperbaiki, dan mengaudit dua halaman landing (portofolio/ dan welcome-aboard/) dengan Node.js tanpa dependensi. Gunakan untuk section UI, CTA, responsive design, aksesibilitas, dan validasi."
argument-hint: "Jelaskan tujuan pekerjaan dan halaman sasaran (portofolio / welcome-aboard)"
user-invocable: true
disable-model-invocation: false
---

# Skill Landing Page Node.js

Workflow untuk perubahan yang terstruktur dan dapat diverifikasi pada dua halaman proyek ini.

## Struktur proyek

```text
TrainingAI/
├── .github/                  # orkestrasi
│   ├── agents/               # perencana, implementer, reviewer
│   ├── hooks/                # 7 hook JSON + implementasi .mjs
│   ├── instructions/         # aturan per tipe berkas
│   ├── prompts/              # template tugas
│   ├── skills/               # workflow ini
│   ├── copilot-instructions.md
│   └── README.md
├── portofolio/               # index.html + styles.css
├── welcome-aboard/           # index.html + styles.css
│   └── assets/               # 9 SVG — SATU-SATUNYA folder aset
├── package.json              # nol dependensi
├── server.mjs                # server statis node:http
└── Step-Step.docx            # dokumen referensi, read-only
```

## Aturan aset

Hanya ada satu folder aset: `welcome-aboard/assets/`.

| Berkas | Prefix wajib |
|---|---|
| `welcome-aboard/index.html` | `assets/<nama>.svg` |
| `portofolio/index.html` | `../welcome-aboard/assets/<nama>.svg` |

Aset wajib (9): `logo.svg`, `icon-arrow-right.svg`, `icon-chevron-left.svg`, `icon-chevron-right.svg`, `icon-cohort.svg`, `icon-craft.svg`, `icon-guild.svg`, `icon-portal.svg`, `icon-track.svg`.

Jangan menyalin, memindahkan, atau menambah folder `assets` lain.

## Prosedur

1. Baca [`references/checklist.md`](./references/checklist.md) dan [`references/acceptance.md`](./references/acceptance.md).
2. Baca halaman sasaran beserta CSS pasangannya. Catat class, section, dan anchor yang **benar-benar ada**.
3. Identifikasi tujuan, audiens, CTA, dan section terdampak.
4. Terapkan diff minimal pada HTML/CSS/JS. Pakai token `:root` yang ada.
5. Periksa aksesibilitas: satu `h1`, focus visible, `prefers-reduced-motion`, `alt` tepat.
6. Jalankan `npm run check:assets` lalu `npm run check`.
7. Bila menyentuh `server.mjs`, jalankan `npm start` dan uji status `200` pada `/` dan `/portofolio/`.
8. Laporkan perubahan, output validasi apa adanya, dan sisa risiko.

## Aturan keputusan

- **Reuse sebelum membuat.** Pakai class dan token yang sudah ada sebelum menambah yang baru.
- **API standar Node.js.** Jangan menambah dependensi; `package.json` harus tetap tanpa `dependencies`.
- **Satu sumber aset.** Semua ikon berasal dari `welcome-aboard/assets/`.
- **Anchor stabil.** Jangan menghapus `id` yang menjadi target anchor (`#main`, `#karya`, `#keahlian`, `#kontak`, `#orientasi`).
- **Validasi tidak boleh diklaim.** Jika `npm run check` gagal, laporkan kegagalannya; jangan menulis "berhasil".
- **Tanpa Python.** Runtime hanya Node.js.

## Peta section

| Halaman | Anchor | Class kunci |
|---|---|---|
| welcome-aboard | `#orientasi` | `.cards`, `.card`, `.card__title`, `.card__desc` |
| welcome-aboard | hero | `.hero`, `.headline`, `.headline__line--gradient`, `.lede` |
| welcome-aboard | actions | `.actions`, `.btn--primary`, `.btn--secondary` |
| welcome-aboard | deck nav | `.deck-nav`, `.pager__controls`, `.pager__btn` |
| portofolio | `#main` | `.page`, `.skip-link` |
| portofolio | `#karya` | `.grid`, `.card`, `.card__meta` |
| portofolio | `#keahlian` | `.section`, `.section__head` |
| portofolio | `#kontak` | `.section--contact`, `.actions` |

## Perintah

```powershell
npm start            # server di http://localhost:3000/
npm run check        # validasi penuh (blocking, exit 1 bila gagal)
npm run check:assets # pemeriksaan cepat aset + anchor + h1
```

## Referensi

- [`references/checklist.md`](./references/checklist.md) — daftar periksa operasional
- [`references/acceptance.md`](./references/acceptance.md) — kriteria penerimaan yang dapat diverifikasi