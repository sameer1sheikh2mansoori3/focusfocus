import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';

    // 1. Supabase Cloud Storage (if configured)
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `poster-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `store/${fileName}`;

        const { data, error } = await supabase.storage
          .from('photos')
          .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            provider: 'supabase-cloud',
          });
        }
      } catch (cloudErr) {
        console.warn('Supabase upload failed, falling back to disk/base64:', cloudErr);
      }
    }

    // 2. Local Disk Storage (local dev environment)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const destination = path.join(uploadsDir, safeName);
      fs.writeFileSync(destination, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${safeName}`,
        provider: 'local-storage',
      });
    } catch (fsErr) {
      console.warn('Local disk not writable (e.g. Vercel serverless read-only filesystem). Falling back to Base64 data URL.');
    }

    // 3. Guaranteed Serverless / Cloud Fallback (Base64 Data URL)
    // Works 100% reliably on Vercel without requiring any external storage!
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      provider: 'base64-data-url',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
