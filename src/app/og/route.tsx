import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Bravee Blog';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0A0A0B',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.15) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              B
            </div>
            <span
              style={{
                marginLeft: '20px',
                fontSize: '32px',
                fontWeight: 600,
                color: '#8B8B8D',
              }}
            >
              Bravee Blog
            </span>
          </div>

          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#EDEDEF',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e.message);
    return new Response('Failed to generate the image', { status: 500 });
  }
}
