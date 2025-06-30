import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaaS Pricing Calculator | Estimate MRR/ARR for Startups',
  description: 'Simulate different pricing models (freemium, tiered, usage-based) to estimate your MRR/ARR potential. Perfect for startups planning their pricing strategy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}