import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';
import { CustomCursor } from '@/components/custom-cursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panda - Adventure Awaits',
  description: 'Meet Panda and embark on magical adventures together. Name your panda friend and discover a world of wonder.',
  keywords: ['panda', 'kids', 'adventure', 'family', 'interactive', 'educational'],
  authors: [{ name: 'Julie Todd', url: 'https://juldd.me' }],
  openGraph: {
    title: 'Panda - Adventure Awaits',
    description: 'Meet Panda and embark on magical adventures together.',
    url: 'https://aipanda.me',
    siteName: 'Panda',
    images: [
      {
        url: '/panda-logo.png', // ✅ Make sure this file exists in /public
        width: 1200,
        height: 630,
        alt: 'Panda Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda - Adventure Awaits',
    description: 'Meet Panda. He needs you to give him a name so you can start this magical adventure together.',
    images: ['/panda-logo.png'], // ✅ Match filename
  },
  icons: {
    icon: '/panda-logo.png',
    shortcut: '/panda-logo.png',
    apple: '/panda-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Footer />
          <CustomCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
