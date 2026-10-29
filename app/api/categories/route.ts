import { NextResponse } from 'next/server';
import { getAllCategories, addCategory, deleteCategory, getAdminPassword } from '@/lib/data';

// Public GET: Anyone can view categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// RESTRICTED POST: ONLY Admin can create a category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentAdminPassword = (await getAdminPassword()).trim();
    
    // Check PIN from header or body
    const providedPin = (request.headers.get('x-admin-pin') || body.adminPin || '').trim();
    if (!providedPin || providedPin !== currentAdminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only the admin can create categories.' },
        { status: 401 }
      );
    }

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const updated = await addCategory(body.name);
    return NextResponse.json({ success: true, data: updated, message: 'Category created by Admin.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add category' }, { status: 500 });
  }
}

// RESTRICTED DELETE: ONLY Admin can delete a category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const currentAdminPassword = (await getAdminPassword()).trim();

    const providedPin = (request.headers.get('x-admin-pin') || searchParams.get('pin') || '').trim();
    if (!providedPin || providedPin !== currentAdminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only the admin can delete categories.' },
        { status: 401 }
      );
    }

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const updated = await deleteCategory(name);
    return NextResponse.json({ success: true, data: updated, message: 'Category removed by Admin.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}

