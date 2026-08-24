import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const publicDir = path.join(process.cwd(), 'public', 'thumbnails');
const cacheDir = path.join(process.cwd(), '.next', 'cache', 'thumbnails');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // If the url is already an image (.png, .jpg, .webp), redirect directly
  const isPdf = url.toLowerCase().includes('.pdf');
  if (!isPdf) {
    return NextResponse.redirect(url);
  }

  try {
    const hash = crypto.createHash('md5').update(url).digest('hex');
    const publicFilePath = path.join(publicDir, `${hash}.png`);
    const cachedFilePath = path.join(cacheDir, `${hash}.png`);

    // 1. Check pre-generated public/thumbnails
    if (fs.existsSync(publicFilePath)) {
      const buf = fs.readFileSync(publicFilePath);
      return new Response(new Uint8Array(buf), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Check disk cache
    if (fs.existsSync(cachedFilePath)) {
      const cachedBuffer = fs.readFileSync(cachedFilePath);
      return new Response(new Uint8Array(cachedBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 3. Download PDF and render first page on the fly
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const doc = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      enableXfa: false,
    }).promise;

    const page = await doc.getPage(1);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = Math.max(1.5, Math.min(2.5, 900 / unscaledViewport.width));
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext('2d');

    // Fill pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // @ts-ignore
    await page.render({
      canvasContext: ctx as any,
      viewport: viewport,
    }).promise;

    const imageBuffer = canvas.toBuffer('image/png');

    // Save to public and cache dir
    try {
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
      fs.writeFileSync(publicFilePath, imageBuffer);
    } catch (e) {}

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cachedFilePath, imageBuffer);
    } catch (e) {}

    return new Response(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.redirect(url);
  }
}
