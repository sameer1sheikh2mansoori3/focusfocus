'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Send,
  Shield,
  Menu,
  X,
  Globe,
  ChevronDown,
  Layers,
  Heart,
} from 'lucide-react';

interface NavbarProps {
  telegramUsername?: string;
  categories?: string[];
}

export default function Navbar({ telegramUsername = 'Seed_Skill', categories = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const cleanTelegram = telegramUsername.replace(/^@/, '');
  const telegramUrl = `https://t.me/${cleanTelegram}`;

  return (
    <div className="w-full">
      {/* 1. Udemy Top Promo Announcement Bar */}
      <div className="bg-[#f7f9fa] border-b border-[#d1d7dc] text-[#1c1d1f] text-xs py-2 px-4 text-center font-medium hidden sm:block">
        <span className="font-bold">Jump into learning for less |</span> Courses starting at just ₹449 ends soon. Enroll directly via Telegram{' '}
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#a435f0] hover:underline">
          @{cleanTelegram}
        </a>
      </div>

      {/* 2. Main Udemy Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#d1d7dc] shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[72px] gap-3 lg:gap-4">
            
            {/* Logo - Authentic Udemy Style */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <span className="font-extrabold text-[28px] tracking-tighter text-[#1c1d1f] flex items-center font-sans">
                <span>udemy</span>
                <span className="text-[#a435f0] font-black ml-0.5">•</span>
                <span className="text-xs font-bold text-[#a435f0] tracking-normal uppercase bg-purple-100 px-1.5 py-0.5 rounded ml-1">
                  SeedSkill
                </span>
              </span>
            </Link>

            {/* Categories Mega Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                className="flex items-center gap-1.5 text-sm text-[#1c1d1f] hover:text-[#a435f0] px-3 py-2 rounded transition font-medium"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6a6f73] transition-transform ${catDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {catDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded shadow-2xl border border-[#d1d7dc] py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 text-[11px] font-bold text-[#6a6f73] uppercase tracking-wider border-b border-gray-100">
                    Explore Popular Categories
                  </div>
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href="#courses"
                      onClick={() => setCatDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-[#1c1d1f] hover:bg-[#f7f9fa] hover:text-[#a435f0] transition font-normal"
                    >
                      <span>{cat}</span>
                      <span className="text-[#6a6f73] text-xs">›</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Center Search Bar (Real Udemy Pill Style) */}
            <div className="flex-1 max-w-2xl mx-1 lg:mx-3 hidden sm:block">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#6a6f73] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for anything (e.g. Next.js, Python, AI Agents, Premiere Pro...)"
                  className="w-full bg-[#f7f9fa] hover:bg-white focus:bg-white border border-[#1c1d1f] rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1c1d1f] placeholder-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f] transition"
                />
              </div>
            </div>

            {/* Business & Teach Links (Udemy Authentic) */}
            <nav className="hidden xl:flex items-center gap-5 text-sm font-normal text-[#1c1d1f]">
              <a href="#courses" className="hover:text-[#a435f0] transition whitespace-nowrap">
                Udemy Business
              </a>
              <Link href="/admin" className="hover:text-[#a435f0] transition whitespace-nowrap">
                Teach on Udemy
              </Link>
            </nav>

            {/* Cart & Wishlist Icons */}
            <div className="hidden lg:flex items-center gap-3 text-[#1c1d1f]">
              <a href="#courses" className="p-2 hover:text-[#a435f0] relative" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#a435f0] text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
              </a>
            </div>

            {/* Action Buttons: Log In & Enroll On Telegram */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-none sm:rounded border border-[#1c1d1f] text-[#1c1d1f] font-bold text-sm hover:bg-gray-100 transition whitespace-nowrap"
              >
                Instructor Log in
              </Link>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c1d1f] hover:bg-[#2d2f31] text-white font-bold text-sm px-4 py-2 rounded-none sm:rounded flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 text-[#0088cc] fill-current" />
                <span>Enroll @{cleanTelegram}</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-[#1c1d1f] rounded-none sm:rounded hover:bg-gray-100 text-[#1c1d1f]"
                title="Global Student Community"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center gap-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#0088cc]"
              >
                <Send className="w-5 h-5 fill-current" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1c1d1f] hover:bg-gray-100 rounded"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* 3. Udemy Sub-navigation (Popular Category Strip) */}
        <div className="hidden lg:block border-t border-[#d1d7dc] bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-[13px] text-[#1c1d1f] scrollbar-none font-normal">
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Development</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Business</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Finance & Accounting</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">IT & Software</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Office Productivity</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Personal Development</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Design</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Marketing</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Health & Fitness</a>
              <a href="#courses" className="hover:text-[#a435f0] whitespace-nowrap">Music</a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#d1d7dc] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="relative w-full mb-3">
            <Search className="w-4 h-4 text-[#6a6f73] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-[#f7f9fa] border border-[#1c1d1f] rounded-full pl-9 pr-3 py-2 text-xs"
            />
          </div>
          <a
            href="#courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#1c1d1f]"
          >
            Explore Courses
          </a>
          <a
            href="#blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#1c1d1f]"
          >
            Learning Roadmaps
          </a>
          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2.5">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 border border-[#1c1d1f] text-[#1c1d1f] font-bold text-xs rounded"
            >
              Instructor Studio Login
            </Link>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2.5 bg-[#a435f0] text-white font-bold text-xs rounded shadow"
            >
              Enroll on Telegram @{cleanTelegram}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
