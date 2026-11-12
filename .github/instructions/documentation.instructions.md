---
name: "Aturan Dokumentasi"
description: "Gunakan saat menulis atau mengubah berkas Markdown di .github/ maupun dokumentasi proyek: bahasa, struktur heading, tautan relatif, dan konsistensi path."
applyTo: "**/*.md"
---

# Aturan Dokumentasi

Berlaku untuk `.github/**/*.md`, `PROMPT.md`, dan dokumentasi lain di repo.

## Bahasa

- Gunakan **bahasa Indonesia** untuk prosa, kecuali istilah teknis yang lebih tepat dalam bahasa Inggris (`hook`, `prompt`, `skill`, `frontmatter`, `anchor`, `token`).
- Kalimat ringkas. Hindari paragraf lebih dari 5 baris.
- Gunakan tabel untuk pemetaan path, berkas, dan status.

## Struktur heading

- Satu `# H1` per dokumen, sesuai nama berkas atau perannya.
- Heading tidak melompat level (`##` -> `###`, jangan `##` -> `####`).
- Setiap bagian punya tujuan yang jelas; tidak ada bagian kosong.

## Tautan relatif

- Tautan ke berkas proyek memakai path relatif yang benar dari lokasi dokumen.
- Dari `.github/README.md`: `../portofolio/index.html`, `../welcome-aboard/index.html`, `../welcome-aboard/assets/`, `../package.json`, `../server.mjs`.
- Dari `.github/skills/node-landing-page/SKILL.md`: `references/checklist.md`.
- Jangan memakai path absolut (`c:\Users\...`) di dalam dokumentasi.

## Path aset — jangan sampai salah tulis

Satu-satunya folder aset adalah `welcome-aboard/assets/`.

| Konteks | Penulisan yang benar |
|---|---|
| Halaman orientasi | `assets/logo.svg` |
| Halaman portofolio | `../welcome-aboard/assets/logo.svg` |
| Dokumentasi | `welcome-aboard/assets/logo.svg` |

Jangan menulis "aset di root" atau `../assets/...`; struktur itu sudah tidak berlaku.

## Frontmatter

Berkas di `.github/` yang berperan sebagai customization wajib punya frontmatter YAML:

| Jenis | Field wajib |
|---|---|
| `*.agent.md` | `name`, `description` |
| `*.prompt.md` | `description` |
| `*.instructions.md` | `description`, `applyTo` |
| `SKILL.md` | `name`, `description` |

Frontmatter harus berada di awal berkas, dibuka dan ditutup `---`.

## Akurasi

- Jangan mendokumentasikan berkas, script, atau perintah yang tidak ada. Periksa dulu.
- Jika sebuah validasi belum dijalankan, tulis "belum diverifikasi", bukan "berhasil".
- Jangan mencantumkan perintah `npm` yang tidak ada di `package.json`.

## Setelah perubahan

Jalankan `npm run check`. Hook `check-customization-frontmatter.mjs` akan memeriksa frontmatter dan JSON hook.