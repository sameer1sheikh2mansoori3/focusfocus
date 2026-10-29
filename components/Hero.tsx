'use client';

import { Send, ArrowRight } from 'lucide-react';
import { Course } from '@/lib/data';

interface HeroProps {
  featuredCourse?: Course | null;
  telegramUsername?: string;
}

export default function Hero({ featuredCourse, telegramUsername = 'Seed_Skill' }: HeroProps) {
  const cleanTelegram = telegramUsername.replace(/^@/, '');
  const telegramUrl = `https://t.me/${cleanTelegram}`;

  return (
    <section className="relative bg-white border-b border-[#d1d7dc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Udemy Billboard Photographic Hero */}
        <div className="relative rounded-none sm:rounded overflow-hidden bg-[#f7f9fa] min-h-[380px] sm:min-h-[460px] flex items-center shadow-sm">
          
          {/* Billboard Real Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
              alt="Udemy Learning Billboard"
              className="w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:via-white/70" />
          </div>

          {/* Floating White Card (Classic Udemy Signature Element) */}
          <div className="relative z-10 m-4 sm:m-12 max-w-[460px] bg-white p-6 sm:p-9 shadow-[0_4px_16px_rgba(0,0,0,0.16)] rounded-none sm:rounded border border-[#d1d7dc]">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#1c1d1f] font-serif tracking-tight leading-[1.2]">
              Skills that drive you forward
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-[#2d2f31] leading-relaxed">
              Technology and the world of work change fast — with us, you’re faster. Learn practical skills with direct creator mentorship.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#courses"
                className="bg-[#1c1d1f] hover:bg-[#2d2f31] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-none sm:rounded text-center transition"
              >
                Browse In-Demand Courses
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-none sm:rounded text-center flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Enroll @{cleanTelegram}</span>
              </a>
            </div>

            <p className="text-[11px] text-[#6a6f73] mt-3 font-medium">
              ⚡ Instant drive access & student group via Telegram
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
