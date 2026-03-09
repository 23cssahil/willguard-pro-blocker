import { NextRequest, NextResponse } from 'next/server';
import { initSheet } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, duration, partnerEmail } = await req.json();
    const sheet = await initSheet();
    
    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + duration);

    // Find row or add new
    const rows = await sheet.getRows();
    let row = rows.find(r => r.get('userId') === userId);

    if (row) {
      row.set('lockUntil', lockUntil.toISOString());
      row.set('partnerEmail', partnerEmail);
      await row.save();
    } else {
      await sheet.addRow({
        userId,
        email,
        lockUntil: lockUntil.toISOString(),
        streak: '0',
        partnerEmail
      });
    }

    return NextResponse.json({ success: true, lockUntil });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
