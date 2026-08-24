import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PrismaClient } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'thumbnails');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const certs = await prisma.certificate.findMany();
  console.log(`Generating thumbnails for ${certs.length} certificates...`);

  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (!cert.imageUrl || !cert.imageUrl.toLowerCase().includes('.pdf')) continue;

    const hash = crypto.createHash('md5').update(cert.imageUrl).digest('hex');
    const outFile = path.join(outDir, `${hash}.png`);

    try {
      console.log(`[${i + 1}/${certs.length}] Processing: ${cert.name}`);
      const res = await fetch(cert.imageUrl);
      if (!res.ok) throw new Error(`Fetch status: ${res.status}`);
      const buf = await res.arrayBuffer();

      const doc = await pdfjsLib.getDocument({
        data: new Uint8Array(buf),
        enableXfa: false,
      }).promise;

      const page = await doc.getPage(1);
      const unscaled = page.getViewport({ scale: 1 });
      const scale = Math.max(1.5, Math.min(2.5, 900 / unscaled.width));
      const viewport = page.getViewport({ scale });

      const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // @ts-ignore
      await page.render({ canvasContext: ctx, viewport }).promise;
      const pngBuf = canvas.toBuffer('image/png');
      fs.writeFileSync(outFile, pngBuf);
      console.log(`  -> Saved ${hash}.png (${pngBuf.length} bytes)`);
    } catch (err) {
      console.error(`  -> Failed for ${cert.name}:`, err.message);
    }
  }

  // Also do profile resume if PDF
  const profile = await prisma.profile.findUnique({ where: { id: 'profile' } });
  if (profile && profile.resumeUrl && profile.resumeUrl.toLowerCase().includes('.pdf')) {
    const hash = crypto.createHash('md5').update(profile.resumeUrl).digest('hex');
    const outFile = path.join(outDir, `${hash}.png`);
    console.log(`Processing resume: ${profile.resumeUrl}`);
    try {
      const res = await fetch(profile.resumeUrl);
      const buf = await res.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf), enableXfa: false }).promise;
      const page = await doc.getPage(1);
      const unscaled = page.getViewport({ scale: 1 });
      const scale = Math.max(1.5, Math.min(2.5, 900 / unscaled.width));
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // @ts-ignore
      await page.render({ canvasContext: ctx, viewport }).promise;
      fs.writeFileSync(outFile, canvas.toBuffer('image/png'));
      console.log('  -> Saved resume thumbnail');
    } catch (e) {
      console.error('  -> Resume failed:', e.message);
    }
  }

  await prisma.$disconnect();
  console.log('ALL THUMBNAILS PRE-RENDERED SUCCESSFULLY!');
}

main().catch(console.error);
