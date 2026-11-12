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
        {/* Theme detection */}
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
        {/* Google Fonts: Space Grotesk + Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {/* Global cursor glow — follows mouse on every page */}
        <div id="cursor-glow" aria-hidden="true" />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var glowEl = document.getElementById('cursor-glow');
                if (!glowEl) return;
                var mouseX = window.innerWidth / 2;
                var mouseY = window.innerHeight / 2;
                var currentX = mouseX;
                var currentY = mouseY;
                document.addEventListener('mousemove', function(e) {
                  mouseX = e.clientX;
                  mouseY = e.clientY;
                  glowEl.style.left = e.clientX + 'px';
                  glowEl.style.top = e.clientY + 'px';
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
