# Panduan Proyek — Training AI

## Konteks

Tugas akhir landing page dengan dua halaman terpisah, dibangun tanpa framework dan tanpa dependensi npm.

```text
TrainingAI/
├── .github/                  # orkestrasi Copilot
│   ├── agents/               # perencana, implementer, reviewer
│   ├── hooks/                # 7 hook JSON + implementasi Node.js
│   ├── instructions/         # aturan per tipe berkas
│   ├── prompts/              # template tugas
│   ├── skills/               # workflow end-to-end
│   ├── copilot-instructions.md
│   └── README.md
├── portofolio/               # index.html + styles.css
├── welcome-aboard/           # index.html + styles.css
│   └── assets/               # 9 SVG — satu-satunya folder aset
├── package.json              # tanpa dependencies
├── server.mjs                # server statis node:http
└── Step-Step.docx            # dokumen referensi (read-only)
```

Pemisahan markup (`index.html`), gaya (`styles.css`), dan aset tetap dipertahankan. Aset bersama berada di `welcome-aboard/assets/` dan dipakai lintas halaman.

## Aturan aset — beda prefix per halaman

| Berkas | Prefix wajib | Contoh |
|---|---|---|
| `welcome-aboard/index.html` | `assets/` | `assets/logo.svg` |
| `portofolio/index.html` | `../welcome-aboard/assets/` | `../welcome-aboard/assets/logo.svg` |

Hanya ada satu folder aset di seluruh repo: `welcome-aboard/assets/` (9 berkas SVG). Jangan menyalin, memindahkan, atau menduplikasi aset. Jangan membuat `assets/` di `portofolio/` maupun di root.

## Aturan utama

- Gunakan bahasa Indonesia untuk teks UI, dokumentasi, dan penjelasan perubahan, kecuali istilah teknis yang lebih tepat dalam bahasa Inggris.
- Baca instruksi file-spesifik sebelum mengubah berkas.
- Setiap halaman berada di foldernya sendiri; jangan menaruh `index.html` di root.
- Jangan menambahkan framework atau dependensi baru. `package.json` harus tetap tanpa `dependencies`.
- Runtime hanya Node.js, memakai API bawaan (`node:fs`, `node:path`, `node:http`, `node:process`, `node:url`). Jangan memakai Python.
- Utamakan HTML semantik, navigasi keyboard, kontras warna, `alt` yang tepat, `:focus-visible`, dan dukungan `prefers-reduced-motion`.
- Pertahankan desain visual yang sudah ada; ubah hanya bagian yang terkait kebutuhan.
- Jangan menyimpan secret, token, atau data pribadi di repository.
- Jangan mengubah `Step-Step.docx`.

## Alur orkestrasi

1. `/rancang-landing-page` — susun rencana dan acceptance criteria.
2. Agen `perencana-landing-page` — pecah kebutuhan per section.
3. `/bangun-section-landing-page` — implementasi satu section.
4. Agen `implementer-node-landing` — terapkan diff minimal pada HTML/CSS/JS.
5. `/audit-kualitas-web` — audit aksesibilitas, responsivitas, performa.
6. Agen `reviewer-kualitas-web` — laporkan temuan dengan bukti.
7. Hook `Stop` — jalankan `validate-workspace.mjs`; gagal berarti sesi tidak selesai.
8. `/siapkan-review` — rangkum perubahan untuk review manusia.

## Validasi

```powershell
npm start            # http://localhost:3000/
npm run check        # validasi penuh, exit 1 bila ada pelanggaran
npm run check:assets # pemeriksaan cepat aset, anchor, dan h1
```

Yang diverifikasi oleh `npm run check`:

- Struktur root tidak memuat entri liar.
- Kelima subfolder `.github/` ada dan terisi.
- Setiap `hooks/*.json` punya `hooks/scripts/*.mjs` pasangannya.
- Hanya ada satu folder `assets`, yaitu `welcome-aboard/assets/`.
- Sembilan aset wajib lengkap.
- Dua halaman: referensi aset valid, anchor valid, tepat satu `h1`.
- `package.json` tanpa `dependencies`, dengan script `start`, `check`, `check:assets`.
- `server.mjs` hanya memakai API bawaan Node.js.

- Jika perintah wajib tidak tersedia, laporkan secara eksplisit; jangan menggantinya dengan keberhasilan palsu.

## Struktur pendukung

- [README orkestrasi](./README.md) — fungsi tiap folder dan setiap berkas.
- [Skill landing page Node.js](./skills/node-landing-page/SKILL.md) — workflow yang dapat dipakai ulang.
- [Kriteria penerimaan](./skills/node-landing-page/references/acceptance.md) — daftar yang dapat diverifikasi.
- [Dokumen langkah pengerjaan](../Step-Step.docx) — rangkuman orkestrasi.