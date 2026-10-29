import { getAllCourses, getAllBlogs, getStats, getAllCategories } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CompanyTrustBar from '@/components/CompanyTrustBar';
import CourseMarketplace from '@/components/CourseMarketplace';
import BlogSection from '@/components/BlogSection';
import TelegramBanner from '@/components/TelegramBanner';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';

// Revalidate on changes
export const revalidate = 0;

export default async function Home() {
  const courses = await getAllCourses();
  const blogs = await getAllBlogs();
  const stats = await getStats();
  const categories = await getAllCategories();

  const featuredCourse = courses.find((c) => c.featured) || courses[0] || null;
  const telegramUsername = stats.telegramUsername || 'Seed_Skill';

  return (
    <div className="min-h-screen bg-white text-[#1c1d1f] flex flex-col justify-between">
      {/* Udemy Header with Categories & Search Bar */}
      <Navbar telegramUsername={telegramUsername} categories={categories} />

      {/* Main Content */}
      <main>
        {/* Udemy Billboard Photographic Hero */}
        <Hero
          featuredCourse={featuredCourse}
          telegramUsername={telegramUsername}
        />

        {/* Corporate Trust Logos (Volkswagen, Samsung, Cisco, Vimeo, etc.) */}
        <CompanyTrustBar />

        {/* Udemy Course Marketplace (Tabs, Rating stars, Bestseller badges, ₹ price) */}
        <CourseMarketplace
          courses={courses}
          categories={categories}
          telegramUsername={telegramUsername}
        />

        {/* Free Learning Guides & Tech Roadmaps */}
        <BlogSection
          blogs={blogs}
          telegramUsername={telegramUsername}
        />

        {/* Telegram Direct Enrollment Banner */}
        <TelegramBanner
          telegramUsername={telegramUsername}
        />
      </main>

      {/* Udemy Dark Multi-Column Footer */}
      <Footer telegramUsername={telegramUsername} />

      {/* Floating Telegram Support Widget */}
      <FloatingTelegram telegramUsername={telegramUsername} />
    </div>
  );
}
