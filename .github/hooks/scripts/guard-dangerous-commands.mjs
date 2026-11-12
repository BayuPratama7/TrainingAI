/**
 * Hook PreToolUse — memblokir perintah destruktif.
 *
 * Fokus pada perlindungan dua halaman proyek:
 *   portofolio/  dan  welcome-aboard/
 */

import { readHookPayload, extractCommand, deny, pass } from './lib/project.mjs';

const payload = readHookPayload();
const command = extractCommand(payload);

if (!command) {
  pass();
  process.exit(0);
}

const RULES = [
  {
    name: 'Hapus rekursif paksa',
    re: /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b/i,
    msg: 'Perintah `rm -rf` memblokir penghapusan rekursif paksa.'
  },
  {
    name: 'Format volume Windows',
    re: /\bformat(\.com)?\s+[a-z]:/i,
    msg: 'Perintah `format` pada drive diblokir.'
  },
  {
    name: 'Hapus item PowerShell rekursif',
    re: /\bRemove-Item\b[^\n]*\s-(?:Recurse|Force)/i,
    msg: '`Remove-Item -Recurse/-Force` diblokir karena berisiko menghapus halaman proyek.'
  },
  {
    name: 'Rmdir paksa',
    re: /\b(?:rmdir|rd)\s+\/s\b/i,
    msg: '`rmdir /s` memblokir penghapusan direktori rekursif.'
  },
  {
    name: 'Reset git hard',
    re: /\bgit\s+reset\s+--hard\b/i,
    msg: '`git reset --hard` membuang pekerjaan yang belum di-commit. Lakukan manual bila memang perlu.'
  },
  {
    name: 'Git clean paksa',
    re: /\bgit\s+clean\s+-[a-zA-Z]*[xfd]/i,
    msg: '`git clean` dengan `-x`/`-f`/`-d` menghapus berkas tak terlacak secara permanen.'
  },
  {
    name: 'Eksfiltrasi via piping ke jaringan',
    re: /\b(?:curl|wget|Invoke-WebRequest|iwr)\b[^\n|]*\|\s*(?:ba)?sh\b/i,
    msg: 'Pola unduh-lalu-eksekusi (pipe ke shell) diblokir.'
  },
  {
    name: 'Unggah berkas proyek ke luar',
    re: /\bcurl\b[^\n]*(?:-F|--upload-file|-d\s*@)/i,
    msg: 'Unggahan berkas via curl berisiko mengekspor isi proyek. Batalkan bila bukan tujuan yang jelas.'
  },
  {
    name: 'Penonaktifan hooks',
    re: /\b(?:git\s+commit\b[^\n]*--no-verify|--no-verify)\b/i,
    msg: '`--no-verify` melewati hook validasi dan diblokir.'
  },
  {
    name: 'Perubahan izin global',
    re: /\b(?:chmod\s+-R\s+777|icacls\b[^\n]*\/grant\b)/i,
    msg: 'Perubahan izin menyeluruh (777 / icacls grant) diblokir.'
  },
  {
    name: 'Target di luar proyek',
    re: /\b(?:rm|Remove-Item|del)\b[^\n]*(?:\.\.\/|C:\\Windows|C:\\Program Files)/i,
    msg: 'Perintah penghapusan menunjuk ke luar folder proyek dan diblokir.'
  }
];

for (const { name, re, msg } of RULES) {
  if (re.test(command)) {
    deny(`Ditolak (${name}): ${msg}`);
    process.exit(0);
  }
}

pass();