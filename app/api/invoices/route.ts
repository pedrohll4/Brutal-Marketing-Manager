import { NextResponse } from 'next/server';
import { mockInvoices } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockInvoices,
  });
}
