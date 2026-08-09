import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/ui/Chatbot';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    default: 'Bravee — Tech Blog',
    template: '%s | Bravee',
  },
  description: 'Personal tech blog sharing knowledge on AI, Cloud, Java, Angular, and the journey from junior to senior developer.',
  keywords: ['tech blog', 'programming', 'AI', 'AWS', 'Java', 'Angular', 'web development', 'software engineering'],
  authors: [{ name: 'Bravee' }],
  creator: 'Bravee',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'vi_VN',
    siteName: 'Bravee Blog',
    title: 'Bravee — Tech Blog',
    description: 'Personal tech blog sharing knowledge on AI, Cloud, Java, Angular, and the journey from junior to senior developer.',
    images: [{ url: '/og?title=Bravee%20%E2%80%94%20Tech%20Blog', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bravee06',
    images: ['/og?title=Bravee%20%E2%80%94%20Tech%20Blog'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
        <Analytics />
      </body>
    </html>
  );
}
