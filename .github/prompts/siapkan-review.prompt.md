---
mode: agent
description: "Merangkum perubahan pada portofolio/ dan welcome-aboard/ untuk review manusia, beserta bukti validasi dan sisa risiko."
---

# Siapkan Review

Susun ringkasan siap-review untuk perubahan yang baru dikerjakan.

## Langkah

1. Tentukan berkas yang berubah di:
   - `welcome-aboard/index.html`, `welcome-aboard/styles.css`
   - `portofolio/index.html`, `portofolio/styles.css`
   - `.github/**` (bila menyentuh orkestrasi)
2. Untuk setiap berkas, tulis **apa** yang berubah dan **mengapa**.
3. Jalankan validasi dan kutip hasilnya:

```powershell
npm run check
npm run check:assets
```

4. Bila menyentuh `server.mjs`, jalankan `npm start` dan uji:

```powershell
(Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).StatusCode
(Invoke-WebRequest http://localhost:3000/portofolio/ -UseBasicParsing).StatusCode
```

5. Sebutkan hal yang **belum** tervalidasi beserta alasannya.

## Format keluaran

```markdown
## Ringkasan
<2-3 kalimat: apa yang berubah dan dampaknya>

## Berkas berubah
| Berkas | Perubahan | Alasan |

## Bukti validasi
| Perintah | Exit code | Ringkasan output |

## Yang perlu diperhatikan reviewer
- <titik rawan atau keputusan desain>

## Belum tervalidasi
- <hal + alasan>
```

## Aturan

- Jangan menulis "berhasil" untuk perintah yang belum dijalankan.
- Jangan mengklaim uji visual tanpa benar-benar melihat hasil render.
- Jika ada pelanggaran validasi, tampilkan apa adanya di bagian "Yang perlu diperhatikan reviewer".
- Jangan menyembunyikan regresi.