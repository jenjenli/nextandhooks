import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://jobicy.com/api/v2/remote-jobs', {
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
