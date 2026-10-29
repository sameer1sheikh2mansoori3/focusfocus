-- ===================================================
-- SEED SKILL - 100% FREE SUPABASE BACKEND SCHEMA
-- ===================================================
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "imageUrl" TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 499,
  category TEXT DEFAULT 'Cinematic',
  tags JSONB DEFAULT '[]'::jsonb,
  resolution TEXT DEFAULT '8K Ultra HD',
  "salesCount" INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  "createdAt" TEXT DEFAULT CURRENT_DATE::text
);

-- 2. Create Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  category TEXT DEFAULT 'Tutorials',
  author TEXT DEFAULT 'Seed Skill Studio',
  "readTime" TEXT DEFAULT '4 min read',
  "publishedAt" TEXT DEFAULT CURRENT_DATE::text,
  featured BOOLEAN DEFAULT false
);

-- 3. Create Stats & Config Table
CREATE TABLE IF NOT EXISTS public.stats (
  id TEXT PRIMARY KEY DEFAULT 'main_config',
  "purchaseInquiries" INTEGER DEFAULT 14,
  "photoViews" INTEGER DEFAULT 380,
  "blogReads" INTEGER DEFAULT 215,
  "telegramUsername" TEXT DEFAULT 'Seed_Skill',
  "adminPin" TEXT DEFAULT 'admin123'
);

-- 4. Enable Row Level Security (RLS) & Public Read/Write
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Allow public insert photos" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update photos" ON public.photos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete photos" ON public.photos FOR DELETE USING (true);

CREATE POLICY "Allow public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete blogs" ON public.blogs FOR DELETE USING (true);

CREATE POLICY "Allow public read stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert stats" ON public.stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update stats" ON public.stats FOR UPDATE USING (true);

-- Insert initial stats row if not exists
INSERT INTO public.stats (id, "purchaseInquiries", "photoViews", "blogReads", "telegramUsername", "adminPin")
VALUES ('main_config', 14, 380, 215, 'Seed_Skill', 'admin123')
ON CONFLICT (id) DO NOTHING;

