import { NextResponse } from 'next/server';
import { mockClients } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockClients,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      data: { ...body, id: `cli-${Date.now()}` },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
