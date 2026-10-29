'use client';

import { Send } from 'lucide-react';

interface FloatingTelegramProps {
  telegramUsername?: string;
}

export default function FloatingTelegram({ telegramUsername = 'Seed_Skill' }: FloatingTelegramProps) {
  const cleanTelegram = telegramUsername.replace(/^@/, '');
  const tgUrl = `https://t.me/${cleanTelegram}`;

  return (
    <aside aria-label="Telegram support" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Pill message on hover */}
      <div className="mr-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
        <div className="px-3 py-1.5 rounded-md bg-[#1c1d1f] text-white text-xs font-bold shadow-xl border border-gray-700 flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Enroll or Chat on @{cleanTelegram}</span>
        </div>
      </div>

      {/* Button */}
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on Telegram @${cleanTelegram}`}
        className="relative flex items-center justify-center w-14 h-14 rounded-full udemy-telegram-btn text-white shadow-2xl transform group-hover:scale-105 active:scale-95 transition-all"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-400 border-2 border-white" />
        </span>
        <Send className="w-6 h-6 fill-white" />
      </a>
    </aside>
  );
}
