'use client';

import Link from 'next/link';
import { Send, Shield, Globe } from 'lucide-react';

interface FooterProps {
  telegramUsername?: string;
}

export default function Footer({ telegramUsername = 'Seed_Skill' }: FooterProps) {
  const cleanTelegram = telegramUsername.replace(/^@/, '');

  return (
    <footer className="bg-[#1c1d1f] text-white pt-12 pb-8 border-t border-[#3e4143] text-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Top Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
          <div className="space-y-2.5">
            <h5 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Popular Subjects</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#courses" className="hover:text-white transition">Web Development Bootcamp</a></li>
              <li><a href="#courses" className="hover:text-white transition">Python & Machine Learning</a></li>
              <li><a href="#courses" className="hover:text-white transition">Generative AI & LLMs</a></li>
              <li><a href="#courses" className="hover:text-white transition">Premiere Pro & Video Editing</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Resources</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#blogs" className="hover:text-white transition">Career Roadmaps</a></li>
              <li><a href="#blogs" className="hover:text-white transition">Free Developer Guides</a></li>
              <li><a href="#courses" className="hover:text-white transition">Curriculum Breakdown</a></li>
              <li><a href="#courses" className="hover:text-white transition">Certificate Verification</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Direct Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href={`https://t.me/${cleanTelegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0088cc] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram @{cleanTelegram}
                </a>
              </li>
              <li><span className="text-gray-400">Course Inquiries & Doubts</span></li>
              <li><span className="text-gray-400">UPI / QR Payment Support</span></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Administration</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[#a435f0] hover:underline font-bold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Instructor Admin Portal
                </Link>
              </li>
              <li><span className="text-gray-500">Only authorized instructor can edit</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3e4143] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#a435f0] text-white font-black text-sm flex items-center justify-center">
              S
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              seed<span className="text-[#a435f0]">skill</span>
            </span>
          </div>

          <p>© {new Date().getFullYear()} Seed Skill, Inc. Built with Next.js & Direct Telegram Enrollment.</p>
        </div>

      </div>
    </footer>
  );
}
