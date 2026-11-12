# PROMPT — Bangun Ulang Orkestrasi `.github` + Runtime Node.js

> Dokumen ini adalah **prompt siap pakai**. Copy seluruh isi file ini ke agent, lalu agent membangun orkestrasi dari nol sampai lolos acceptance criteria.

---

## 0. PERAN

Bertindaklah sebagai **AI Engineer senior** yang membangun software lewat orkestrasi agent yang terstruktur, dapat diverifikasi, dan tidak bergantung pada ingatan sesi.

Kamu bekerja di workspace `c:\Users\admin\TrainingAI` pada OS **Windows**, shell **PowerShell**.

---

## 1. KONDISI AWAL (FAKTA TERVERIFIKASI — JANGAN DIASUMSIKAN ULANG)

Kondisi ini sudah diperiksa langsung di disk. Pakai sebagai ground truth:

```text
c:\Users\admin\TrainingAI\
├── portofolio/
│   ├── index.html      ✅ ada
│   └── styles.css      ✅ ada (698 baris)
├── welcome-aboard/
│   ├── assets/         ✅ ada, 9 file SVG
│   │   ├── logo.svg
│   │   ├── icon-arrow-right.svg
│   │   ├── icon-chevron-left.svg
│   │   ├── icon-chevron-right.svg
│   │   ├── icon-cohort.svg
│   │   ├── icon-craft.svg
│   │   ├── icon-guild.svg
│   │   ├── icon-portal.svg
│   │   └── icon-track.svg
│   ├── index.html      ✅ ada
│   └── styles.css      ✅ ada (743 baris)
├── Step-Step.docx      ✅ ada (dokumen referensi, READ-ONLY)
└── .github/            ❌ TIDAK ADA — harus dibangun dari nol
```

Fakta lingkungan:

- **Node.js dan npm TIDAK terpasang.** `node` dan `npm` tidak ada di PATH.
- **Python 3.12 ada, tetapi DILARANG dipakai** sebagai server atau tooling. Semua tooling wajib Node.js.
- **Tidak ada `package.json`.**
- **Tidak ada git repository.**
- Tidak ada folder `assets/` di root. Aset bersama berada di `welcome-aboard/assets/`.

### Aturan path aset yang WAJIB dipertahankan

| Halaman | Pola referensi yang benar |
|---|---|
| `welcome-aboard/index.html` | `assets/<nama>.svg` |
| `portofolio/index.html` | `../welcome-aboard/assets/<nama>.svg` |

Jangan mengubah, memindahkan, menyalin, atau menduplikasi aset. Jangan membuat `assets/` baru di root maupun di `portofolio/`.

---

## 2. FOLDER TARGET (SESUAI GAMBAR)

Bangun persis struktur berikut. **Root hanya berisi 4 entri ini** — tidak lebih:

```text
TrainingAI/
├── .github/
│   ├── agents/
│   ├── hooks/
│   ├── instructions/
│   ├── prompts/
│   ├── skills/
│   ├── copilot-instructions.md
│   └── README.md
├── portofolio/
├── welcome-aboard/       # berisi assets/ di dalamnya
└── Step-Step.docx
```

Di dalam `.github/`, kelima folder (`agents`, `hooks`, `instructions`, `prompts`, `skills`) **wajib ada dan wajib terisi**. Folder kosong tidak diterima.

---

## 3. KONTRAK KONEKTIVITAS (ATURAN PALING PENTING)

Setiap file di `.github/` **wajib menyebut path nyata** dari `portofolio/` dan `welcome-aboard/`. Tidak boleh ada artefak generik yang tidak menunjuk ke proyek ini.

Setiap artefak harus lolos uji: *"Jika file ini dibaca, apakah pembaca tahu file/folder mana di `portofolio/` atau `welcome-aboard/` yang menjadi sasarannya?"* Jawaban wajib **ya**.

### Matriks konektivitas minimum

| Artefak | Wajib menunjuk ke |
|---|---|
| `copilot-instructions.md` | Struktur root 4 entri; aturan path aset dua halaman; larangan duplikasi aset |
| `agents/*.agent.md` | Path halaman konkret + aturan aset konkret |
| `hooks/*.json` | Target validasi: dua `index.html`, dua `styles.css`, folder `welcome-aboard/assets/` |
| `hooks/scripts/*.mjs` | Path absolut-relatif nyata; daftar aset nyata; dua halaman nyata |
| `instructions/*.instructions.md` | `applyTo` yang cocok dengan file nyata (`**/index.html`, `**/styles.css`, `**/*.mjs`) |
| `prompts/*.prompt.md` | Section nyata di halaman: `#orientasi`, `#karya`, `#keahlian`, `#kontak` |
| `skills/*/SKILL.md` | Langkah kerja terhadap dua halaman + `references/checklist.md` |

Sebelum menulis file apa pun, baca dulu `portofolio/index.html`, `portofolio/styles.css`, `welcome-aboard/index.html`, `welcome-aboard/styles.css`. Gunakan nama class dan section yang **benar-benar ada** di sana:

- `welcome-aboard`: `.site-header`, `.brand`, `.status`, `.pill`, `.stage`, `.stage__inner`, `.badge`, `.hero`, `.headline`, `.headline__line`, `.headline__line--gradient`, `.lede`, `.cards`, `.card`, `.card__head`, `.card__icon`, `.card__tag`, `.card__body`, `.card__title`, `.card__desc`, `.actions`, `.btn`, `.btn--primary`, `.btn--secondary`, `.btn__label`, `.btn__icon`, `.deck-nav`, `.deck-nav__context`, `.deck-nav__pager`, `.pager__capsule`, `.pager__controls`, `.pager__btn`, `.ambient-grid`, `.glow`, `.dot`, `.dot--pulse`, `.dot--glow`, `.dot--static`; anchor `#orientasi`.
- `portofolio`: `.skip-link`, `.site-header`, `.brand`, `.brand__mark`, `.site-nav`, `.site-nav__list`, `.site-nav__back`, `.hero`, `.headline`, `.lede`, `.badge`, `.actions`, `.btn`, `.section`, `.section__head`, `.section__title`, `.section__desc`, `.grid`, `.card`, `.section--contact`; anchor `#main`, `#karya`, `#keahlian`, `#kontak`.

---

## 4. SPESIFIKASI TIAP FOLDER

### 4.1 `agents/` — minimal 3 file

| File | Peran | Batas tool | Keluaran wajib |
|---|---|---|---|
| `perencana-landing-page.agent.md` | Memecah kebutuhan jadi section + acceptance criteria | read-only | Daftar section, AC, risiko |
| `implementer-node-landing.agent.md` | Ubah HTML/CSS/JS dengan diff sekecil mungkin | read + edit + execute | Diff + alasan perubahan |
| `reviewer-kualitas-web.agent.md` | Audit aksesibilitas, responsif, performa, regresi | read + execute | Temuan + severity |

Setiap `agent.md` wajib memuat frontmatter (`name`, `description`) dan **Daftar Sasaran** yang menyebut `portofolio/index.html`, `portofolio/styles.css`, `welcome-aboard/index.html`, `welcome-aboard/styles.css`.

### 4.2 `hooks/` — JSON + implementasi Node.js

Pasangan **wajib lengkap**: setiap `*.json` punya `*.mjs` pasangannya. Hook yang menunjuk script tidak ada = cacat.

| JSON | Event | Script `.mjs` | Fungsi |
|---|---|---|---|
| `inject-project-context.json` | `SessionStart` | `inject-project-context.mjs` | Cetak struktur root 4 entri + aturan path aset |
| `guard-env-files.json` | `PreToolUse` | `guard-env-files.mjs` | Blokir pembuatan/ubah `.env` |
| `guard-env-commit.json` | `PreToolUse` | `guard-env-commit.mjs` | Blokir secret ikut commit |
| `guard-dangerous-commands.json` | `PreToolUse` | `guard-dangerous-commands.mjs` | Blokir perintah destruktif |
| `check-html-assets.json` | `PostToolUse` | `check-html-assets.mjs` | Cek referensi aset + anchor + `h1` tunggal di dua halaman |
| `check-customization-frontmatter.json` | `PostToolUse` | `check-customization-frontmatter.mjs` | Validasi frontmatter `.md` dan JSON hook |
| `validate-workspace.json` | `Stop` | `validate-workspace.mjs` | Validasi penuh struktur + Node.js |

Tambahan wajib: `hooks/scripts/lib/project.mjs` sebagai utilitas bersama (root proyek, daftar path wajib, baca stdin, emisi keputusan hook).

**Aturan teknis script `.mjs`:**

- Hanya API bawaan Node.js: `node:fs`, `node:path`, `node:process`, `node:url`. **Tanpa `npm install`.**
- ESM (`import`), bukan CommonJS.
- Guard memakai `permissionDecision: "deny"`; `PostToolUse` hanya melapor lewat `systemMessage` (non-blocking).
- Baca payload hook dari `stdin` sebagai JSON; jangan crash bila stdin kosong.
- Keluar dengan kode 0 saat lolos, kode non-nol saat gagal untuk hook `Stop`.
- **Tanpa** ketergantungan pada Python, PowerShell, atau binary eksternal.

Validasi aset di `check-html-assets.mjs` harus menangani **dua pola path berbeda**:

```js
// welcome-aboard  →  assets/...
// portofolio     →  ../welcome-aboard/assets/...
```

### 4.3 `instructions/` — minimal 4 file dengan `applyTo`

| File | `applyTo` | Fokus |
|---|---|---|
| `html-landing-page.instructions.md` | `**/*.html` | Semantik, satu `h1`, `alt`, anchor valid, aturan path aset dua halaman |
| `css-landing-page.instructions.md` | `**/*.css` | Token warna/font, mobile-first, `:focus-visible`, `prefers-reduced-motion` |
| `node-landing-page.instructions.md` | `**/*.mjs`, `**/*.cjs`, `**/package.json` | API standar Node, validasi input, error handling, tanpa dependensi |
| `documentation.instructions.md` | `**/*.md` | Bahasa Indonesia, tautan relatif, struktur heading |

### 4.4 `prompts/` — minimal 4 file

| Prompt | Fungsi | Sasaran konkret |
|---|---|---|
| `rancang-landing-page.prompt.md` | Rencana + AC sebelum coding | Dua halaman |
| `bangun-section-landing-page.prompt.md` | Bangun/revisi satu section | Anchor `#karya`, `#keahlian`, `#kontak`, `#orientasi` |
| `audit-kualitas-web.prompt.md` | Audit a11y, responsif, SEO, performa | Dua halaman |
| `siapkan-review.prompt.md` | Rangkum perubahan untuk review manusia | Dua halaman |

Setiap prompt memakai frontmatter (`mode`, `description`) dan menyebut file sasaran secara eksplisit.

### 4.5 `skills/` — minimal 1 skill lengkap

```text
skills/node-landing-page/
├── SKILL.md
└── references/
    └── checklist.md
```

`SKILL.md` wajib memuat: deskripsi, prosedur bernomor, aturan keputusan, dan **Struktur proyek** yang mencantumkan `welcome-aboard/assets/` beserta kedua pola path. `checklist.md` wajib memuat butir yang bisa dicentang untuk struktur, aksesibilitas, responsivitas, Node.js, dan validasi.

---

## 5. LAPISAN NODE.JS (ATURAN 2)

### Langkah 0 — Pasang Node.js (WAJIB, karena belum ada)

```powershell
winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
```

Setelah itu **verifikasi**, jangan diasumsikan:

```powershell
node -v
npm -v
```

Jika PATH belum ter-refresh, buka terminal baru. **Jangan lanjut** sebelum `node -v` mengeluarkan versi.

### `package.json` di root

```json
{
  "name": "training-ai-landing-page",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Dua halaman landing statis dengan orkestrasi .github dan server Node.js tanpa dependensi",
  "scripts": {
    "start": "node server.mjs",
    "dev": "node --watch server.mjs",
    "check": "node .github/hooks/scripts/validate-workspace.mjs",
    "check:assets": "node .github/hooks/scripts/check-html-assets.mjs",
    "test": "node .github/hooks/scripts/validate-workspace.mjs"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Field `dependencies` **tidak boleh ada**. Nol dependensi.

### `server.mjs` di root — server statis tanpa dependensi

Ketentuan:

- Pakai `node:http` + `node:fs/promises` + `node:path`. Tanpa Express, tanpa `http-server`.
- Port dari `process.env.PORT`, default `3000`. Jika port terpakai, laporkan jelas dan keluar rapi.
- Sajikan **dari root proyek** agar kedua halaman bisa diakses.
- `GET /` → redirect atau sajikan `welcome-aboard/index.html`.
- `/portofolio` → `portofolio/index.html`. `/welcome-aboard` → `welcome-aboard/index.html`.
- MIME type untuk `.html`, `.css`, `.js`, `.mjs`, `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.ico`, `.json`, `.woff2`.
- **Cegah path traversal**: resolve path lalu pastikan masih di dalam root proyek; tolak dengan `403` bila keluar.
- `404` berstatus benar dengan halaman teks sederhana, bukan stack trace.
- Tangani `HEAD`. Tangani error `EADDRINUSE` dan `EACCES` dengan pesan yang bisa ditindaklanjuti.
- Cetak URL siap buka di konsol:

```text
Server berjalan:
  Welcome Aboard : http://localhost:3000/
  Portofolio     : http://localhost:3000/portofolio/
```

---

## 6. ACCEPTANCE CRITERIA

Jangan menyatakan selesai sebelum **semua** terpenuhi dan diverifikasi dengan perintah nyata:

- [ ] `node -v` mengeluarkan versi ≥ 20.
- [ ] Root hanya berisi `4` entri: `.github/`, `portofolio/`, `welcome-aboard/`, `Step-Step.docx`, `package.json`, `server.mjs`, `PROMPT.md` (file tooling diizinkan; tidak ada folder liar).
- [ ] `.github/` berisi `agents`, `hooks`, `instructions`, `prompts`, `skills`, `copilot-instructions.md`, `README.md`.
- [ ] Kelima subfolder `.github/` **tidak kosong**.
- [ ] Setiap `hooks/*.json` punya file `hooks/scripts/*.mjs` pasangannya.
- [ ] `hooks/scripts/lib/project.mjs` ada dan dipakai bersama.
- [ ] Hanya ada **satu** folder `assets` di seluruh repo, yaitu `welcome-aboard/assets/`.
- [ ] `welcome-aboard/index.html` memakai `assets/...`; `portofolio/index.html` memakai `../welcome-aboard/assets/...`.
- [ ] **18/18** referensi aset di dua halaman menunjuk file yang benar-benar ada.
- [ ] Setiap `href="#..."` punya `id` tujuan di halaman yang sama.
- [ ] Tepat satu `<h1>` per halaman.
- [ ] `npm run check` lolos (exit 0).
- [ ] `npm run check:assets` lolos (exit 0).
- [ ] `npm start` menyajikan dua halaman dengan status `200`.
- [ ] `dependencies` di `package.json` kosong / tidak ada.
- [ ] Tidak ada script yang memanggil `python`, `py`, atau PowerShell sebagai runtime.

---

## 7. PERINTAH VERIFIKASI (JALANKAN, JANGAN DIKLAIM)

```powershell
node -v
npm -v
npm run check
npm run check:assets
npm start
```

Saat server hidup, uji di terminal lain:

```powershell
(Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).StatusCode
(Invoke-WebRequest http://localhost:3000/portofolio/ -UseBasicParsing).StatusCode
(Invoke-WebRequest http://localhost:3000/welcome-aboard/assets/logo.svg -UseBasicParsing).StatusCode
```

Ketiganya harus `200`.

---

## 8. LARANGAN

- ❌ Memakai Python, Flask, atau `python -m http.server`.
- ❌ Menambah dependensi npm (Express, `http-server`, `serve`, dsb.).
- ❌ Memindahkan/menyalin/menduplikasi aset keluar dari `welcome-aboard/assets/`.
- ❌ Membuat `index.html` di root.
- ❌ Membuat `hooks/*.json` tanpa `.mjs` pasangannya.
- ❌ Menulis dokumentasi generik yang tidak menyebut path nyata proyek ini.
- ❌ Mengubah `Step-Step.docx`.
- ❌ Mengubah desain visual dua halaman; tugas ini hanya orkestrasi + runtime.
- ❌ Melaporkan "berhasil" tanpa menjalankan perintah verifikasi.

---

## 9. URUTAN EKSEKUSI

1. Baca `portofolio/index.html`, `portofolio/styles.css`, `welcome-aboard/index.html`, `welcome-aboard/styles.css`. Catat class, section, dan anchor nyata.
2. Pasang Node.js via `winget`. Verifikasi `node -v` ≥ 20.
3. Tulis `package.json` dan `server.mjs`. Uji server hidup dan sajikan satu halaman.
4. Buat kerangka `.github/` beserta kelima subfolder.
5. Tulis `hooks/scripts/lib/project.mjs` lebih dulu, lalu ketujuh script `.mjs`, lalu JSON hook yang menunjuk ke script tersebut.
6. Tulis `copilot-instructions.md` dan `README.md` dengan struktur root 4 entri dan aturan path aset dua halaman.
7. Tulis `agents/`, `instructions/`, `prompts/`, `skills/` — semuanya menunjuk path dan class nyata.
8. Jalankan `npm run check` dan `npm run check:assets`. Perbaiki sampai exit 0.
9. Jalankan uji HTTP tiga URL. Pastikan `200`.
10. Laporkan: file yang dibuat, output verifikasi apa adanya, dan sisa risiko.

---

## 10. FORMAT LAPORAN AKHIR

```markdown
## Dibuat
- <file> — <fungsi>

## Verifikasi
| Perintah | Hasil |
|---|---|
| node -v | <output asli> |
| npm run check | <exit code + ringkasan> |
| npm run check:assets | <exit code + ringkasan> |
| HTTP / , /portofolio/ , /assets/logo.svg | <status> |

## Konektivitas .github
| Artefak | Menunjuk ke |
|---|---|
| ... | ... |

## Sisa risiko
- <hal yang belum tervalidasi dan alasannya>
```