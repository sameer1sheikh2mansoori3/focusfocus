'use client';

import { useState } from 'react';
import { Blog } from '@/lib/data';
import { BookOpen, Calendar, Clock, ArrowRight, X, User, Send } from 'lucide-react';

interface BlogSectionProps {
  blogs: Blog[];
  telegramUsername?: string;
}

export default function BlogSection({ blogs = [], telegramUsername = 'Seed_Skill' }: BlogSectionProps) {
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const cleanTelegram = telegramUsername.replace(/^@/, '');

  // Zero dummy data: if no blogs published yet, do not render placeholder blogs
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section id="blogs" className="py-16 bg-[#f7f9fa] border-t border-[#d1d7dc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
              Learning Guides & Career Roadmaps
            </h2>
            <p className="text-sm text-[#6a6f73] mt-1 max-w-xl">
              Free editorial articles, developer roadmaps, and tech insights.
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-lg border border-[#d1d7dc] overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => setActiveBlog(blog)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#1c1d1f] text-white text-[11px] font-bold">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[#6a6f73] mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#a435f0]" />
                      {blog.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6a6f73]" />
                      {blog.readTime || '5 min read'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveBlog(blog)}
                    className="text-base font-extrabold text-[#1c1d1f] group-hover:text-[#a435f0] transition-colors line-clamp-2 leading-snug cursor-pointer"
                  >
                    {blog.title}
                  </h3>

                  <p className="text-xs text-[#6a6f73] mt-2 line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveBlog(blog)}
                  className="w-full py-2.5 px-4 rounded border border-[#1c1d1f] hover:bg-gray-50 text-[#1c1d1f] font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a435f0]" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8 bg-white rounded-lg shadow-2xl overflow-hidden border border-[#d1d7dc] flex flex-col">
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-1 rounded bg-[#a435f0] text-white text-xs font-bold">
                  {activeBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                  {activeBlog.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 text-xs text-[#6a6f73]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#a435f0]" />
                  <span className="font-bold text-[#1c1d1f]">{activeBlog.author || 'Instructor'}</span>
                </div>
                <span>{activeBlog.publishedAt} • {activeBlog.readTime}</span>
              </div>

              <div className="text-[#1c1d1f] space-y-4 text-sm sm:text-base leading-relaxed">
                {activeBlog.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={index} className="text-lg font-bold text-[#1c1d1f] pt-2">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  return <p key={index} className="text-[#2d2f31]">{paragraph}</p>;
                })}
              </div>

              <div className="pt-6 border-t border-gray-200 bg-[#f7f9fa] p-5 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1c1d1f]">Want hands-on mentorship?</h4>
                  <p className="text-xs text-[#6a6f73]">Join the community on Telegram for daily resources & doubts.</p>
                </div>
                <a
                  href={`https://t.me/${cleanTelegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="udemy-telegram-btn px-5 py-2.5 rounded text-xs font-bold whitespace-nowrap flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>Join @{cleanTelegram}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
