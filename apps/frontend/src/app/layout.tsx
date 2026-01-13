import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import JackpotNotifications from '@/components/JackpotNotifications';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CasinoBit - Provably Fair Casino',
  description: 'Play provably fair casino games with cryptocurrency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <JackpotNotifications />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
