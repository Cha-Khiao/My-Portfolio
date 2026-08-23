import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

// Client for Public / Server interactions (Uses Service Key or Anon Key)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : null;

// Admin Client for Server-side Operations (Uses Service Role Key if available)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Upload a file to Supabase Storage inside the 'portfolio' bucket with organized subfolder.
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  folder: 'certificates' | 'avatars' | 'line-qr' | 'projects' | 'resumes' = 'certificates',
  contentType: string = 'image/jpeg'
): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured in .env');
  }

  const bucketName = 'portfolio';
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage Upload Error: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
