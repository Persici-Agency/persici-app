import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const standaloneDir = path.join(rootDir, '.next', 'standalone');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');

console.log('\n📦 Preparing Hostinger Standalone Production Package...');
console.log('====================================================\n');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ Error: .next/standalone directory was not found.');
  console.error('👉 Please make sure next.config.ts has output: "standalone" and run "npm run build" first.\n');
  process.exit(1);
}

try {
  // 1. Copy public folder
  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true });
    console.log('✅ Copied public/ -> .next/standalone/public');
  }

  // 2. Copy .next/static folder
  if (fs.existsSync(staticSrc)) {
    fs.cpSync(staticSrc, staticDest, { recursive: true });
    console.log('✅ Copied .next/static/ -> .next/standalone/.next/static');
  }

  // 3. Copy ecosystem.config.cjs
  const pm2Src = path.join(rootDir, 'ecosystem.config.cjs');
  const pm2Dest = path.join(standaloneDir, 'ecosystem.config.cjs');
  if (fs.existsSync(pm2Src)) {
    fs.copyFileSync(pm2Src, pm2Dest);
    console.log('✅ Copied ecosystem.config.cjs -> .next/standalone/ecosystem.config.cjs');
  }

  // 4. Create .htaccess for LiteSpeed / Apache reverse proxy
  const htaccessContent = `# =======================================================
# Hostinger LiteSpeed / Apache Reverse Proxy for Next.js
# =======================================================
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Pass Authorization header
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

  # Reverse Proxy to local Node.js server (Default port 3000)
  RewriteCond %{REQUEST_URI} !^/\\.well-known
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>
`;
  fs.writeFileSync(path.join(standaloneDir, '.htaccess'), htaccessContent, 'utf8');
  console.log('✅ Generated .htaccess reverse proxy configuration');

  // 5. Create .env.example
  const envExampleContent = `# Hostinger Production Environment Variables
PORT=3000
NODE_ENV=production
HOSTNAME=0.0.0.0
`;
  fs.writeFileSync(path.join(standaloneDir, '.env.example'), envExampleContent, 'utf8');
  console.log('✅ Generated .env.example');

  console.log('\n🎉 Standalone Production Package is ready at:');
  console.log(`📁 ${path.relative(rootDir, standaloneDir)}`);
  console.log('\n💡 You can now upload the contents of .next/standalone directly to your Hostinger server!\n');
} catch (err) {
  console.error('❌ Failed to prepare standalone package:', err);
  process.exit(1);
}
