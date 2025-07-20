import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Custom SMS API - Professional SMS Management Platform',
  description: 'Advanced SMS API service with user management, API keys, and analytics',
  keywords: 'SMS API, Grameenphone, SMS service, API management, SMS gateway',
  authors: [{ name: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴' }],
  openGraph: {
    title: 'Custom SMS API Platform',
    description: 'Professional SMS management platform with advanced features',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`} suppressHydrationWarning>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
