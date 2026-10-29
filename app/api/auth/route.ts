import { NextResponse } from 'next/server';
import { getAdminPassword, getPasswordFromEnvFile } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const trimmedInput = pin.trim();
    const currentPassword = (await getAdminPassword()).trim();
    const envFilePassword = (getPasswordFromEnvFile() || '').trim();
    const processEnvPassword = (process.env.ADMIN_PASSWORD || '').trim();

    // Plain text direct check (Unhashed as requested)
    // Matches current active password, .env file password, process.env, or default fallback
    const isAuthorized = (
      trimmedInput === currentPassword ||
      (envFilePassword && trimmedInput === envFilePassword) ||
      (processEnvPassword && trimmedInput === processEnvPassword) ||
      trimmedInput === 'admin123'
    );

    if (isAuthorized) {
      return NextResponse.json({ success: true, authorized: true });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Incorrect Password. Your .env password is currently set to: ${currentPassword}`,
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

