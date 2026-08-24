import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-memory / disk cache for generated thumbnails
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
    // Check disk cache first for instant 0ms response
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const hash = crypto.createHash('md5').update(url).digest('hex');
    const cachedFilePath = path.join(cacheDir, `${hash}.png`);

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

    // Download PDF and render first page
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
    // Scale to high resolution (approx 900px wide) for crisp preview
    const scale = Math.max(1.5, Math.min(2.5, 900 / unscaledViewport.width));
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext('2d');

    // Fill white background in case PDF has transparent backdrop
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // @ts-ignore
    await page.render({
      canvasContext: ctx as any,
      viewport: viewport,
    }).promise;

    // Encode to PNG for ultra-crisp certificate graphics
    const imageBuffer = canvas.toBuffer('image/png');

    // Write to disk cache
    try {
      fs.writeFileSync(cachedFilePath, imageBuffer);
    } catch (e) {
      console.warn('Cache write failed:', e);
    }

    return new Response(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Thumbnail generation error:', error);
    // If error, redirect directly to original URL
    return NextResponse.redirect(url);
  }
}
