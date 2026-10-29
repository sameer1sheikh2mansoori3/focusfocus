'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Course } from '@/lib/data';
import {
  Search,
  Send,
  Star,
  CheckCircle,
  PlayCircle,
  X,
  Clock,
  BookOpen,
  Award,
  Video,
  Download,
  Plus,
} from 'lucide-react';

interface CourseMarketplaceProps {
  courses: Course[];
  categories?: string[];
  telegramUsername?: string;
  onRecordPurchase?: (course: Course) => void;
}

export default function CourseMarketplace({
  courses = [],
  categories = [],
  telegramUsername = 'Seed_Skill',
  onRecordPurchase,
}: CourseMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalCourse, setActiveModalCourse] = useState<Course | null>(null);

  // Available categories
  const availableCategories = useMemo(() => {
    const list = new Set<string>();
    list.add('All');
    if (categories && categories.length > 0) {
      categories.forEach((c) => list.add(c));
    }
    courses.forEach((c) => {
      if (c.category) list.add(c.category);
    });
    return Array.from(list);
  }, [courses, categories]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === 'All' || course.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const handleEnrollClick = (course: Course) => {
    if (onRecordPurchase) {
      onRecordPurchase(course);
    } else {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record_inquiry' }),
      }).catch(() => {});
    }
  };

  const cleanTelegram = telegramUsername.replace(/^@/, '');

  return (
    <section id="courses" className="py-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
            A broad selection of courses
          </h2>
          <p className="text-sm sm:text-base text-[#6a6f73] mt-1">
            Choose from real masterclasses. Direct enrollment and student support via Telegram @{cleanTelegram}.
          </p>
        </div>

        {/* Category Tabs (Udemy Style) */}
        {availableCategories.length > 1 && (
          <div className="border-b border-[#d1d7dc] mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                    selectedCategory === category
                      ? 'border-[#1c1d1f] text-[#1c1d1f]'
                      : 'border-transparent text-[#6a6f73] hover:text-[#1c1d1f]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Controls */}
        {courses.length > 0 && (
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#6a6f73] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course title..."
                className="w-full bg-white border border-[#d1d7dc] focus:border-[#1c1d1f] rounded-md pl-10 pr-8 py-2 text-sm text-[#1c1d1f] placeholder-[#6a6f73] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Zero Dummy Data - Clean Empty State */}
        {courses.length === 0 ? (
          <div className="text-center py-20 px-4 bg-[#f7f9fa] rounded border border-[#d1d7dc]">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#a435f0] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1c1d1f]">No courses published yet</h3>
            <p className="text-xs sm:text-sm text-[#6a6f73] mt-1 max-w-md mx-auto">
              Your store is clean with zero dummy courses. Log in to the Instructor Portal to create your first real course!
            </p>
            <div className="mt-5">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded udemy-btn-primary font-bold text-xs shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Go to Instructor Portal</span>
              </Link>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-[#f7f9fa] rounded border border-[#d1d7dc]">
            <p className="text-[#1c1d1f] font-bold text-sm">No courses matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded bg-[#1c1d1f] text-white text-xs font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const tgEnrollUrl = `https://t.me/${cleanTelegram}?text=${encodeURIComponent(
                `Hello @${cleanTelegram}! I want to enroll in the course: "${course.title}" [ID: ${course.id}, Price: ₹${course.price}]. Please provide payment and course drive access.`
              )}`;

              return (
                <div
                  key={course.id}
                  className="udemy-card rounded-md overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Poster / Thumbnail */}
                    <div
                      onClick={() => setActiveModalCourse(course)}
                      className="relative aspect-video w-full overflow-hidden bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#1c1d1f] flex items-center justify-center shadow-lg">
                          <PlayCircle className="w-6 h-6 text-[#a435f0]" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
                        {course.duration}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-4">
                      {/* Course Title */}
                      <h3
                        onClick={() => setActiveModalCourse(course)}
                        className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#a435f0] transition-colors cursor-pointer"
                      >
                        {course.title}
                      </h3>

                      {/* Instructor */}
                      <p className="text-[12px] text-[#6a6f73] mt-1 truncate">{course.instructor}</p>

                      {/* Ratings */}
                      <div className="flex items-center gap-1.5 text-xs mt-1.5">
                        <span className="font-extrabold text-[#b4690e]">{course.rating || 5.0}</span>
                        <div className="flex text-[#e59819] text-xs">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-[#6a6f73] text-[11px]">({course.reviewsCount || 0})</span>
                      </div>

                      {/* Duration & Lectures */}
                      <p className="text-[11px] text-[#6a6f73] mt-1">
                        {course.duration} • {course.lecturesCount || 10} lectures • {course.level || 'All Levels'}
                      </p>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mt-2.5">
                        <span className="text-base font-extrabold text-[#1c1d1f]">₹{course.price}</span>
                        {course.originalPrice > course.price && (
                          <span className="text-xs text-[#6a6f73] line-through">₹{course.originalPrice}</span>
                        )}
                      </div>

                      {/* Bestseller Badge */}
                      {course.badge && (
                        <div className="mt-2.5">
                          <span className="udemy-bestseller-badge">
                            {course.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <a
                      href={tgEnrollUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleEnrollClick(course)}
                      className="flex-1 udemy-telegram-btn py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 text-center"
                    >
                      <Send className="w-3.5 h-3.5 fill-white" />
                      <span>Enroll @{cleanTelegram}</span>
                    </a>

                    <button
                      onClick={() => setActiveModalCourse(course)}
                      className="px-3 py-2 border border-[#d1d7dc] hover:border-[#1c1d1f] rounded text-xs font-bold text-[#1c1d1f] transition"
                      title="View Course Syllabus"
                    >
                      Curriculum
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Udemy-Style Course Detail Modal */}
      {activeModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8 bg-white rounded-lg shadow-2xl overflow-hidden border border-[#d1d7dc] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#1c1d1f] text-white p-6 sm:p-8 relative">
              <button
                onClick={() => setActiveModalCourse(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModalCourse.badge && (
                <div className="inline-block udemy-bestseller-badge mb-3">
                  {activeModalCourse.badge}
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {activeModalCourse.title}
              </h2>

              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {activeModalCourse.headline || activeModalCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 mt-4">
                <span className="text-[#e59819] font-bold">★ {activeModalCourse.rating || 5.0}</span>
                <span>•</span>
                <span>Created by <strong className="text-white">{activeModalCourse.instructor}</strong></span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* "What you'll learn" Box */}
              {activeModalCourse.whatYouWillLearn && activeModalCourse.whatYouWillLearn.length > 0 && (
                <div className="border border-[#d1d7dc] bg-[#f7f9fa] rounded-md p-5">
                  <h3 className="font-extrabold text-base text-[#1c1d1f] mb-3">
                    What you'll learn in this course
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#1c1d1f]">
                    {activeModalCourse.whatYouWillLearn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#1c1d1f] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Features */}
              <div>
                <h4 className="font-bold text-sm text-[#1c1d1f] mb-2">This course includes:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#6a6f73]">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#a435f0]" />
                    <span>{activeModalCourse.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#a435f0]" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#a435f0]" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#a435f0]" />
                    <span>Full lifetime access</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Bar */}
              <div className="pt-6 border-t border-[#d1d7dc] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#1c1d1f]">₹{activeModalCourse.price}</span>
                    {activeModalCourse.originalPrice > activeModalCourse.price && (
                      <span className="text-sm text-[#6a6f73] line-through">₹{activeModalCourse.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6a6f73]">Instant drive access & mentorship via Telegram</p>
                </div>

                <a
                  href={`https://t.me/${cleanTelegram}?text=${encodeURIComponent(
                    `Hello @${cleanTelegram}! I want to enroll in the course: "${activeModalCourse.title}" [ID: ${activeModalCourse.id}, Price: ₹${activeModalCourse.price}]. Please provide payment and course drive access.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleEnrollClick(activeModalCourse)}
                  className="w-full sm:w-auto udemy-telegram-btn px-8 py-3.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>Enroll Now on Telegram @{cleanTelegram}</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}
