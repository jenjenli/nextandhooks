import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://job-backend-topaz.vercel.app/api/jobs', {
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
