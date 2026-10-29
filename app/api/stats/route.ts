import { NextResponse } from 'next/server';
import { getStats, recordPurchaseInquiry, updateSettings, getAdminPassword } from '@/lib/data';
import { getMongoUri } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const stats = await getStats();
    const hasMongo = Boolean(getMongoUri());
    const currentPlainPassword = await getAdminPassword();

    // Check if requester is authenticated admin via header
    const providedPin = request.headers.get('x-admin-pin');
    const isAuthedAdmin = providedPin && providedPin.trim() === currentPlainPassword.trim();

    const { adminPin, ...safeStats } = stats;

    return NextResponse.json({
      success: true,
      data: {
        ...safeStats,
        // Only reveal plain text password to authenticated admin
        currentPlainPassword: isAuthedAdmin ? currentPlainPassword : null,
        backendType: hasMongo ? 'MongoDB Atlas (Connected)' : 'Local Engine',
        isCloudConnected: hasMongo,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentPassword = await getAdminPassword();

    // Action: record inquiry (public)
    if (body.action === 'record_inquiry') {
      const stats = await recordPurchaseInquiry();
      const { adminPin, ...safeStats } = stats;
      return NextResponse.json({ success: true, data: safeStats });
    }

    // Action: update settings (requires old/current password to be verified!)
    if (body.action === 'update_settings') {
      if (!body.currentPin || body.currentPin.trim() !== currentPassword.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: 'Old Password does not match! You must provide the correct current password to make changes.',
          },
          { status: 401 }
        );
      }

      const updates: any = {};
      if (body.telegramUsername) {
        updates.telegramUsername = body.telegramUsername.replace(/^@/, '');
      }
      
      // Store new plain text password directly (No hashing as requested)
      if (body.newPin && body.newPin.trim()) {
        updates.adminPin = body.newPin.trim();
      }

      const updated = await updateSettings(updates);
      const { adminPin, ...safeStats } = updated;

      return NextResponse.json({
        success: true,
        data: safeStats,
        newPlainPassword: updates.adminPin || currentPassword,
        message: 'Settings and Password updated successfully!',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Request failed' }, { status: 500 });
  }
}
