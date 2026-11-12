---
name: "Aturan HTML Landing Page"
description: "Gunakan saat membuat atau mengubah HTML pada portofolio/index.html atau welcome-aboard/index.html: struktur semantik, heading, alt, anchor, dan referensi aset bersama."
applyTo: "**/*.html"
---

# Aturan HTML Landing Page

Berlaku untuk `welcome-aboard/index.html` dan `portofolio/index.html`.

## Struktur

- Gunakan elemen semantik: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Tepat **satu** `<h1>` per halaman. Hierarki heading tidak boleh melompat.
- Jangan menaruh `index.html` baru di root proyek.

## Referensi aset — beda prefix per halaman

Hanya ada **satu** folder aset di repo: `welcome-aboard/assets/` (9 SVG).

| Berkas | Prefix wajib | Contoh |
|---|---|---|
| `welcome-aboard/index.html` | `assets/` | `<img src="assets/logo.svg" ...>` |
| `portofolio/index.html` | `../welcome-aboard/assets/` | `<img src="../welcome-aboard/assets/logo.svg" ...>` |

Jangan menyalin, memindahkan, atau menduplikasi aset. Jangan membuat `assets/` di `portofolio/` maupun di root.

## Interaksi dan aksesibilitas

- Semua kontrol interaktif terjangkau keyboard dan punya nama jelas.
- Tombol ikon wajib punya `aria-label` (contoh: `.pager__btn` dengan `aria-label="Previous slide"`).
- Gambar dekoratif memakai `alt=""`; gambar informatif memakai `alt` deskriptif.
- Tambahkan `aria-label` hanya bila nama semantik native belum cukup.
- `aria-labelledby` harus menunjuk `id` yang benar-benar ada.

## Anchor

Setiap `href="#..."` wajib punya elemen dengan `id` yang sesuai di halaman yang sama.

- `portofolio/index.html`: `#main`, `#karya`, `#keahlian`, `#kontak`, plus `#judul-hero`, `#judul-karya`, `#judul-keahlian`, `#judul-kontak` sebagai target `aria-labelledby`.
- `welcome-aboard/index.html`: `#orientasi`.

Jangan menghapus atau mengganti `id` tersebut tanpa memperbarui semua perujuknya.

## Metadata

- `lang="id"` pada `<html>`.
- `<title>` dan `<meta name="description">` wajib ada dan relevan dengan isi halaman.
- Pertahankan `<meta name="viewport">` dan `preconnect` Google Fonts yang sudah ada.

## Larangan

- Inline `style` dan inline `<script>`.
- Menambah berkas di `welcome-aboard/assets/` tanpa kebutuhan yang dijelaskan.
- Mengubah teks yang sudah disetujui tanpa permintaan eksplisit.

## Setelah perubahan

1. Cek anchor, `id`, dan urutan tab.
2. Jalankan `npm run check:assets`.
3. Jalankan `npm run check` bila perubahan menyentuh struktur.