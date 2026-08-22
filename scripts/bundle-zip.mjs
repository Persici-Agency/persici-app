import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const zipOutput = path.join(rootDir, 'hostinger-production.zip');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ .next/standalone not found. Run npm run build:prod first.');
  process.exit(1);
}

console.log('\n🗜️  Creating hostinger-production.zip...');

try {
  if (fs.existsSync(zipOutput)) {
    fs.unlinkSync(zipOutput);
  }

  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${standaloneDir}\\*' -DestinationPath '${zipOutput}' -Force"`,
      { stdio: 'inherit' }
    );
  } else {
    execSync(`cd "${standaloneDir}" && zip -r "${zipOutput}" ./*`, { stdio: 'inherit' });
  }

  const stats = fs.statSync(zipOutput);
  console.log(`\n🎉 Success! Created archive: ${path.basename(zipOutput)}`);
  console.log(`📦 File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`📁 Location: ${zipOutput}`);
  console.log('👉 Upload this ZIP file to your Hostinger file manager and extract it.\n');
} catch (err) {
  console.error('❌ Failed to create zip bundle:', err);
  process.exit(1);
}
