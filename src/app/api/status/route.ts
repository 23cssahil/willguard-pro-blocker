import { NextRequest, NextResponse } from 'next/server';
import { initSheet } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  try {
    const sheet = await initSheet();
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('userId') === userId);

    if (!row) return NextResponse.json({ isLocked: false });

    const lockUntil = new Date(row.get('lockUntil'));
    const isLocked = lockUntil > new Date();

    return NextResponse.json({
      isLocked,
      lockUntil: row.get('lockUntil'),
      streak: row.get('streak')
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
