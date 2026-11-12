/**
 * Hook PreToolUse — mencegah pembuatan atau pengubahan berkas `.env`.
 *
 * Berlaku untuk seluruh proyek, termasuk portofolio/ dan welcome-aboard/.
 */

import path from 'node:path';
import { readHookPayload, extractPaths, extractCommand, deny, pass } from './lib/project.mjs';

const payload = readHookPayload();

/** Pola nama berkas .env beserta variannya. */
const ENV_FILE = /(^|[/\\])\.env(\.[a-zA-Z0-9_-]+)?$/i;
/** Deteksi penulisan .env lewat perintah shell. */
const ENV_WRITE_CMD = /(^|[\s;&|])(?:echo|printf|cat|tee|Set-Content|Add-Content|Out-File|New-Item)\b[\s\S]{0,200}?\.env(\s|$|["'])/i;
/** Deteksi perintah yang menyentuh .env secara umum. */
const ENV_TOUCH_CMD = /(^|[\s'"=])(?:\.env|.*[/\\]\.env)(\.[a-zA-Z0-9_-]+)?($|[\s'";&|])/i;

for (const target of extractPaths(payload)) {
  if (ENV_FILE.test(target)) {
    deny(
      `Ditolak: berkas "${path.basename(target)}" adalah berkas environment. ` +
        'Jangan membuat atau mengubah berkas .env di repository ini. ' +
        'Gunakan variabel lingkungan proses atau dokumentasikan nama variabelnya saja.'
    );
    process.exit(0);
  }
}

const command = extractCommand(payload);
if (command) {
  if (ENV_WRITE_CMD.test(command) || ENV_TOUCH_CMD.test(command)) {
    deny(
      'Ditolak: perintah ini menyentuh berkas .env. ' +
        'Berkas .env tidak boleh dibuat, ditulis, atau diubah dari sesi agent.'
    );
    process.exit(0);
  }
}

pass();