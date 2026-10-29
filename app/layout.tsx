import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeedSkill | Online Courses - Learn In-Demand Skills',
  description:
    'Explore top-rated online courses in Next.js, Python, Artificial Intelligence, Video Editing & Cyber Security. Enroll directly via Telegram @Seed_Skill.',
  keywords: [
    'Online Courses',
    'Udemy Clone',
    'Web Development Bootcamp',
    'Python AI Course',
    'SeedSkill',
    'Telegram Course Store',
    'Learn To Code',
  ],
  authors: [{ name: 'Seed Skill Masterclass Academy' }],
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-[#1c1d1f] antialiased">
        {children}
      </body>
    </html>
  );
}
