import { CookieBanner } from "@/components/CookieBanner";
import './globals.css';
import { Outfit, JetBrains_Mono } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Tattoos by Jake Llewellyn — Tattoos by Jake Llewellyn',
  description: 'Tattoos by Jake Llewellyn — Tattoos by Jake Llewellyn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#09090B] text-[#FAFAFA] font-sans antialiased min-h-screen selection:bg-[#8B5CF6] selection:text-[#FAFAFA]">
        {children}
              <CookieBanner />
      </body>
    </html>
  );
}