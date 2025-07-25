import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = 5; 
const WINDOW_SIZE_IN_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const currentTime = Date.now();
  const rateLimitInfo = rateLimitMap.get(ip);

  if (!rateLimitInfo || currentTime > rateLimitInfo.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: currentTime + WINDOW_SIZE_IN_MS });
  } else {
    if (rateLimitInfo.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((rateLimitInfo.resetTime - currentTime) / 1000);
      return new NextResponse(
        JSON.stringify({ error: `Rate limit exceeded. Try again in ${retryAfter}s.` }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    rateLimitInfo.count += 1;
    rateLimitMap.set(ip, rateLimitInfo);
  }

  const res = await fetch('https://job-backend-topaz.vercel.app/api/jobs');
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
