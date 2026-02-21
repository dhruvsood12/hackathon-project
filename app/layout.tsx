import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'DRIVE UCSD - Ride Sharing for UCSD Students',
  description: 'Connect with fellow UCSD students for rides',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}

