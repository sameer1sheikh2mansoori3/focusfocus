import { NextResponse } from 'next/server';
import { getAllPhotos, savePhoto, updatePhoto, deletePhoto } from '@/lib/data';

export async function GET() {
  try {
    const photos = await getAllPhotos();
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.imageUrl || !body.price) {
      return NextResponse.json({ success: false, error: 'Title, Image URL, and Price are required' }, { status: 400 });
    }

    const created = await savePhoto({
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl,
      price: Number(body.price),
      category: body.category || 'General',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Art']),
      resolution: body.resolution || 'High Resolution Digital Copy',
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Photo ID is required' }, { status: 400 });
    }

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t: string) => t.trim());
    }
    if (updates.price) {
      updates.price = Number(updates.price);
    }

    const updated = await updatePhoto(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Photo ID is required' }, { status: 400 });
    }

    const deleted = await deletePhoto(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete photo' }, { status: 500 });
  }
}
