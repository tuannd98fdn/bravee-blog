import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!redis) {
    // Graceful fallback if Redis is not configured
    return NextResponse.json({ views: 0 }, { status: 200 });
  }

  try {
    const views = await redis.incr(`pageviews:blog:${slug}`);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error incrementing views for', slug, error);
    return NextResponse.json({ views: 0 }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!redis) {
    return NextResponse.json({ views: 0 }, { status: 200 });
  }

  try {
    const views = await redis.get<number>(`pageviews:blog:${slug}`);
    return NextResponse.json({ views: views || 0 });
  } catch (error) {
    console.error('Error fetching views for', slug, error);
    return NextResponse.json({ views: 0 }, { status: 500 });
  }
}
