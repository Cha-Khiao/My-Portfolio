import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { isAuthenticated } from '@/lib/auth';
import { isSupabaseConfigured, uploadToSupabaseStorage } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;
    const folder = (formData.get('folder') as string) || 'certificates';

    // 1. Handle Base64 Upload (e.g. from circular Avatar Cropper)
    if (base64Data) {
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: 'Invalid base64 string' }, { status: 400 });
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const ext = mimeType.includes('png') ? '.png' : mimeType.includes('webp') ? '.webp' : '.jpg';
      const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

      // Upload to Supabase Storage if configured
      if (isSupabaseConfigured) {
        try {
          const publicUrl = await uploadToSupabaseStorage(
            buffer,
            fileName,
            (folder as any) || 'avatars',
            mimeType
          );
          return NextResponse.json({ url: publicUrl, fileName });
        } catch (supabaseErr: any) {
          console.warn('Supabase upload fallback to local:', supabaseErr.message);
        }
      }

      // Local Disk Fallback
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
    }

    // 2. Handle Binary File Upload (e.g. Certificate Image / PDF / LINE QR)
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalExt = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
    const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${originalExt}`;
    const contentType = file.type || (originalExt === '.pdf' ? 'application/pdf' : 'image/jpeg');

    // Upload to Supabase Storage if configured
    if (isSupabaseConfigured) {
      try {
        const publicUrl = await uploadToSupabaseStorage(
          buffer,
          fileName,
          (folder as any) || 'certificates',
          contentType
        );
        return NextResponse.json({
          url: publicUrl,
          fileName,
          size: file.size,
          type: contentType,
        });
      } catch (supabaseErr: any) {
        console.warn('Supabase upload fallback to local:', supabaseErr.message);
      }
    }

    // Local Disk Fallback
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      fileName,
      size: file.size,
      type: contentType,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Error uploading file' }, { status: 500 });
  }
}
