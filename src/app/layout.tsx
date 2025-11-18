import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Lexend } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});


export const metadata: Metadata = {
  title: 'Mercedes Benz AI Configurator',
  description: 'Find your perfect Mercedes-Benz with our AI-powered quiz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
