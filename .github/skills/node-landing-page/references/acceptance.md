# Kriteria Penerimaan

Kriteria yang dapat diverifikasi perintah untuk proyek Training AI.

## Struktur

| # | Kriteria | Cara verifikasi |
|---|---|---|
| 1 | Root hanya berisi entri yang diizinkan | `Get-ChildItem -Name` |
| 2 | `.github/` memuat `agents`, `hooks`, `instructions`, `prompts`, `skills`, `copilot-instructions.md`, `README.md` | `Get-ChildItem .github -Name` |
| 3 | Kelima subfolder `.github/` tidak kosong | `npm run check` |
| 4 | Hanya satu folder `assets`: `welcome-aboard/assets/` | `npm run check` |
| 5 | Tidak ada `index.html` di root | `Test-Path index.html` -> False |

## Aset

| # | Kriteria | Cara verifikasi |
|---|---|---|
| 6 | 9 aset wajib ada | `npm run check` |
| 7 | `welcome-aboard/index.html` memakai `assets/...` | `npm run check:assets` |
| 8 | `portofolio/index.html` memakai `../welcome-aboard/assets/...` | `npm run check:assets` |
| 9 | Semua rujukan aset menunjuk berkas yang ada | `npm run check:assets` |

## Halaman

| # | Kriteria | Cara verifikasi |
|---|---|---|
| 10 | Tepat satu `<h1>` per halaman | `npm run check:assets` |
| 11 | Semua anchor punya `id` tujuan | `npm run check:assets` |
| 12 | `lang="id"`, `title`, `meta[name=description]` ada | tinjau `<head>` |
| 13 | `server.mjs` menyajikan `/` dan `/portofolio/` dengan `200` | `npm start` + HTTP check |

## Runtime

| # | Kriteria | Cara verifikasi |
|---|---|---|
| 14 | `node -v` >= 20 | `node -v` |
| 15 | `package.json` tanpa `dependencies` | `npm run check` |
| 16 | Script `start`, `check`, `check:assets` tersedia | `npm run check` |
| 17 | `server.mjs` hanya mengimpor `node:*` | `npm run check` |
| 18 | Tidak ada script yang memakai Python sebagai runtime | `npm run check` |

## Orkestrasi

| # | Kriteria | Cara verifikasi |
|---|---|---|
| 19 | Setiap `hooks/*.json` punya `.mjs` pasangannya | `npm run check` |
| 20 | `hooks/scripts/lib/project.mjs` ada dan dipakai | `npm run check` |
| 21 | Frontmatter customization lengkap | `node .github/hooks/scripts/check-customization-frontmatter.mjs` |

## Perintah ringkas

```powershell
node -v
npm run check
npm run check:assets
npm start
```

Saat server hidup, di terminal lain:

```powershell
(Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).StatusCode                     # 200
(Invoke-WebRequest http://localhost:3000/portofolio/ -UseBasicParsing).StatusCode          # 200
(Invoke-WebRequest http://localhost:3000/welcome-aboard/assets/logo.svg -UseBasicParsing).StatusCode  # 200
```

## Aturan pelaporan

- Kutip output asli, bukan ringkasan karangan.
- Jika sebuah perintah gagal, tulis gagal beserta pesannya.
- Jika belum dijalankan, tulis "belum diverifikasi".