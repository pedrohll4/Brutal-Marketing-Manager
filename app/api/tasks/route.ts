import { NextResponse } from 'next/server';
import { mockTasks } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockTasks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: { ...body, id: `tsk-${Date.now()}` },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
