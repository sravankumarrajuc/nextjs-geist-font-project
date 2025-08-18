import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Review Pilot AI - Customer Review Intelligence Platform',
  description: 'Centralize review intake, reduce response time with AI-assisted replies, and detect sentiment trends to drive operational improvements.',
  keywords: 'review management, AI responses, sentiment analysis, customer feedback, business intelligence',
  authors: [{ name: 'Review Pilot AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Review Pilot AI - Customer Review Intelligence Platform',
    description: 'Centralize review intake, reduce response time with AI-assisted replies, and detect sentiment trends to drive operational improvements.',
    type: 'website',
    url: 'https://reviewpilot.ai',
    siteName: 'Review Pilot AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Review Pilot AI - Customer Review Intelligence Platform',
    description: 'Centralize review intake, reduce response time with AI-assisted replies, and detect sentiment trends to drive operational improvements.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
