import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAMVERO – AI-Powered Lead Generation Platform',
  description: 'Find the Right Leads. Build Better Connections. Aggregate verified leads from Google My Business, Bark, Upwork, and LinkedIn with auto-generated websites, mobile apps, and client outreach.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
