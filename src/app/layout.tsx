import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAMVERO – AI-Powered Lead Generation Platform',
  description: 'Find the Right Leads. Build Better Connections. Aggregate verified leads from Google My Business, Bark, Upwork, and LinkedIn with auto-generated websites, mobile apps, and client outreach.',
  icons: {
    icon: [
      { url: '/samvero-icon.png' },
      { url: '/favicon.png' },
    ],
    shortcut: '/samvero-icon.png',
    apple: '/samvero-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('samvero_theme');
                var isDark = stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
