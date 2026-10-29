import { NextResponse } from 'next/server';
import { getAllCourses, saveCourse, updateCourse, deleteCourse } from '@/lib/data';

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.thumbnailUrl || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Title, Thumbnail Poster, and Price are required' },
        { status: 400 }
      );
    }

    const created = await saveCourse({
      title: body.title,
      headline: body.headline || body.title,
      description: body.description || '',
      thumbnailUrl: body.thumbnailUrl,
      previewVideoUrl: body.previewVideoUrl || '',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice) || Number(body.price) * 5,
      category: body.category || 'Web Development',
      instructor: body.instructor || 'Seed Skill Academy',
      duration: body.duration || '35.0 total hours',
      lecturesCount: Number(body.lecturesCount) || 120,
      level: body.level || 'All Levels',
      badge: body.badge || 'Bestseller',
      whatYouWillLearn: Array.isArray(body.whatYouWillLearn)
        ? body.whatYouWillLearn
        : body.whatYouWillLearn
        ? body.whatYouWillLearn.split('\n').filter(Boolean)
        : ['Comprehensive curriculum from zero to professional', 'Hands-on real world projects'],
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
    if (updates.lecturesCount) updates.lecturesCount = Number(updates.lecturesCount);
    if (updates.whatYouWillLearn && typeof updates.whatYouWillLearn === 'string') {
      updates.whatYouWillLearn = updates.whatYouWillLearn.split('\n').filter(Boolean);
    }

    const updated = await updateCourse(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const deleted = await deleteCourse(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}
