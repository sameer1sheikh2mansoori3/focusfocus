'use client';

import { Send, CheckCircle, Award, Users, BookOpen } from 'lucide-react';

interface TelegramBannerProps {
  telegramUsername?: string;
}

export default function TelegramBanner({ telegramUsername = 'Seed_Skill' }: TelegramBannerProps) {
  const cleanTelegram = telegramUsername.replace(/^@/, '');
  const tgUrl = `https://t.me/${cleanTelegram}`;

  return (
    <section className="py-16 bg-white border-t border-[#d1d7dc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="bg-[#1c1d1f] text-white rounded-lg p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="inline-block udemy-bestseller-badge">
              DIRECT TELEGRAM ENROLLMENT
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Start learning today. Enroll directly via Telegram @{cleanTelegram}
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">
              No complicated subscription locks. When you choose a course, you message directly on Telegram. Upon UPI/QR payment, you instantly receive complete uncompressed video lectures, source code repositories, and private student doubts support.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-[#a435f0] shrink-0" />
                <span>Lifetime Drive Access</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-[#a435f0] shrink-0" />
                <span>1-on-1 Mentor Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-[#a435f0] shrink-0" />
                <span>Course Completion Certificate</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="udemy-telegram-btn px-8 py-4 rounded-md font-bold text-base flex items-center justify-center gap-3 shadow-lg"
            >
              <Send className="w-5 h-5 fill-white" />
              <span>Connect on @{cleanTelegram}</span>
            </a>
            <span className="text-xs text-gray-400">Usually active & replies within minutes</span>
          </div>

        </div>
      </div>
    </section>
  );
}
