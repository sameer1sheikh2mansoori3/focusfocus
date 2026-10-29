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

    // Check if Supabase client is available for cloud upload
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `store/${fileName}`;

        const { data, error } = await supabase.storage
          .from('photos')
          .upload(filePath, buffer, {
            contentType: file.type || 'image/jpeg',
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
        console.warn('Supabase upload fallback to local storage:', cloudErr);
      }
    }

    // Local file fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const destination = path.join(uploadsDir, safeName);
    fs.writeFileSync(destination, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'local-storage',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}

