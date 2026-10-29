import fs from 'fs';
import path from 'path';
import { getMongoDatabase, getMongoUri } from './mongodb';

export interface Course {
  id: string;
  title: string;
  headline: string;
  description: string;
  thumbnailUrl: string; // Course poster / cover image
  previewVideoUrl?: string; // Optional preview trailer or drive link
  price: number;
  originalPrice: number;
  category: string;
  instructor: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  lecturesCount: number;
  level: string;
  badge?: 'Bestseller' | 'Highest Rated' | 'Hot & New' | '';
  whatYouWillLearn: string[];
  featured: boolean;
  createdAt: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
}

export interface SiteStats {
  purchaseInquiries: number;
  courseViews: number;
  blogReads: number;
  telegramUsername: string;
  adminPin: string;
}

const dataDir = path.join(process.cwd(), 'data');
const coursesPath = path.join(dataDir, 'courses.json');
const blogsPath = path.join(dataDir, 'blogs.json');
const statsPath = path.join(dataDir, 'stats.json');
const categoriesPath = path.join(dataDir, 'categories.json');

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Local JSON Helpers
function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// ==================== AUTH / PLAIN TEXT PASSWORD ====================
// Direct helper to read ADMIN_PASSWORD from .env.local or .env file
export function getPasswordFromEnvFile(): string | null {
  try {
    const cwd = process.cwd();
    for (const file of ['.env.local', '.env']) {
      const fullPath = path.join(cwd, file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const match = content.match(/^ADMIN_PASSWORD\s*=\s*(.*)$/m);
        if (match && match[1]) {
          let val = match[1].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1).trim();
          }
          if (val) return val;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading env file for password:', e);
  }
  return null;
}

// Direct helper to sync updated password directly to .env and .env.local
export function syncPasswordToEnvFiles(newPassword: string): void {
  try {
    const cwd = process.cwd();
    for (const file of ['.env.local', '.env']) {
      const fullPath = path.join(cwd, file);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (/^ADMIN_PASSWORD\s*=.*$/m.test(content)) {
          content = content.replace(/^ADMIN_PASSWORD\s*=.*$/m, `ADMIN_PASSWORD=${newPassword}`);
        } else {
          content += `\nADMIN_PASSWORD=${newPassword}\n`;
        }
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
    process.env.ADMIN_PASSWORD = newPassword;
  } catch (err) {
    console.error('Failed to sync password to .env files:', err);
  }
}

export function getDefaultAdminPassword(): string {
  return getPasswordFromEnvFile() || process.env.ADMIN_PASSWORD || 'admin123';
}

export async function getAdminPassword(): Promise<string> {
  // 1. Direct file check on disk (.env.local / .env)
  const envFilePassword = getPasswordFromEnvFile();
  if (envFilePassword) {
    return envFilePassword;
  }

  // 2. process.env check
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

  // 3. Database check
  try {
    const db = await getMongoDatabase();
    if (db) {
      const doc = await db.collection('stats').findOne({ id: 'main_config' });
      if (doc && doc.adminPin) {
        return doc.adminPin; // Plain text unhashed
      }
    }
  } catch (err) {}

  // 4. Local storage fallback
  const stats = readJson<SiteStats>(statsPath, {
    purchaseInquiries: 0,
    courseViews: 0,
    blogReads: 0,
    telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'Seed_Skill',
    adminPin: 'admin123',
  });

  return stats.adminPin || 'admin123';
}

// ==================== CATEGORIES (Admin Only Managed) ====================
export const DEFAULT_CATEGORIES: string[] = [
  'Web Development',
  'Python & Data Science',
  'Artificial Intelligence',
  'Video Editing',
  'Cyber Security',
  'Mobile App Development',
  'Graphic Design',
  'Digital Marketing',
];

export async function getAllCategories(): Promise<string[]> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      const items = await db.collection('categories').find({}).toArray();
      if (items && items.length > 0) {
        return items.map((doc: any) => doc.name);
      }
    }
  } catch (err) {
    console.warn('MongoDB categories fetch failed:', err);
  }

  const local = readJson<string[]>(categoriesPath, []);
  if (local && local.length > 0) {
    return local;
  }
  return DEFAULT_CATEGORIES;
}

export async function addCategory(name: string): Promise<string[]> {
  const trimmed = name.trim();
  if (!trimmed) return getAllCategories();

  const current = await getAllCategories();
  if (!current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    current.push(trimmed);

    try {
      const db = await getMongoDatabase();
      if (db) {
        await db.collection('categories').updateOne({ name: trimmed }, { $set: { name: trimmed } }, { upsert: true });
      }
    } catch (err) {
      console.warn('MongoDB addCategory error:', err);
    }

    writeJson(categoriesPath, current);
  }

  return current;
}

export async function deleteCategory(name: string): Promise<string[]> {
  const current = await getAllCategories();
  const filtered = current.filter((c) => c.toLowerCase() !== name.toLowerCase());

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('categories').deleteOne({ name });
    }
  } catch (err) {
    console.warn('MongoDB deleteCategory error:', err);
  }

  writeJson(categoriesPath, filtered);
  return filtered;
}

// ==================== COURSES (Zero Dummy Data) ====================
export async function getAllCourses(): Promise<Course[]> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      const docs = await db.collection('courses').find({}).sort({ createdAt: -1 }).toArray();
      if (docs) {
        return docs.map(({ _id, ...rest }: any) => rest as Course);
      }
    }
  } catch (err) {
    console.warn('MongoDB courses fetch failed:', err);
  }

  // Zero dummy data
  return readJson<Course[]>(coursesPath, []);
}

export async function saveCourse(
  course: Omit<Course, 'id' | 'createdAt' | 'studentsCount' | 'reviewsCount' | 'rating'>
): Promise<Course> {
  const newCourse: Course = {
    ...course,
    id: `course-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 0,
    studentsCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };

  // Automatically register category to global categories list if not present
  if (newCourse.category && newCourse.category.trim()) {
    try {
      await addCategory(newCourse.category.trim());
    } catch (e) {
      console.warn('Failed to auto-register category on saveCourse:', e);
    }
  }

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('courses').insertOne(newCourse);
    }
  } catch (err) {
    console.warn('MongoDB saveCourse error:', err);
  }

  const courses = readJson<Course[]>(coursesPath, []);
  courses.unshift(newCourse);
  writeJson(coursesPath, courses);
  return newCourse;
}

export async function updateCourse(id: string, updated: Partial<Course>): Promise<Course | null> {
  if (updated.category && updated.category.trim()) {
    try {
      await addCategory(updated.category.trim());
    } catch (e) {
      console.warn('Failed to auto-register category on updateCourse:', e);
    }
  }

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('courses').updateOne({ id }, { $set: updated });
      const found = await db.collection('courses').findOne({ id });
      if (found) {
        const { _id, ...course } = found as any;
        return course as Course;
      }
    }
  } catch (err) {
    console.warn('MongoDB updateCourse error:', err);
  }

  const courses = readJson<Course[]>(coursesPath, []);
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  courses[index] = { ...courses[index], ...updated };
  writeJson(coursesPath, courses);
  return courses[index];
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('courses').deleteOne({ id });
    }
  } catch (err) {
    console.warn('MongoDB deleteCourse error:', err);
  }

  const courses = readJson<Course[]>(coursesPath, []);
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;
  writeJson(coursesPath, filtered);
  return true;
}

// Aliases for compatibility
export type Photo = Course;
export const getAllPhotos = getAllCourses;
export const savePhoto = (item: any) =>
  saveCourse({
    title: item.title,
    headline: item.description || item.title,
    description: item.description || '',
    thumbnailUrl: item.imageUrl || item.thumbnailUrl,
    previewVideoUrl: item.downloadUrl || '',
    price: item.price || 499,
    originalPrice: item.price ? item.price * 6 : 3499,
    category: item.category || 'General',
    instructor: 'Seed Skill Academy',
    duration: '32.0 total hours',
    lecturesCount: 120,
    level: 'All Levels',
    badge: 'Bestseller',
    whatYouWillLearn: ['Hands-on practical curriculum'],
    featured: Boolean(item.featured),
  });
export const updatePhoto = updateCourse;
export const deletePhoto = deleteCourse;

// ==================== BLOGS (Zero Dummy Data) ====================
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      const docs = await db.collection('blogs').find({}).sort({ publishedAt: -1 }).toArray();
      if (docs) {
        return docs.map(({ _id, ...rest }: any) => rest as Blog);
      }
    }
  } catch (err) {
    console.warn('MongoDB blogs fetch failed:', err);
  }

  return readJson<Blog[]>(blogsPath, []);
}

export async function saveBlog(blog: Omit<Blog, 'id' | 'publishedAt'>): Promise<Blog> {
  const newBlog: Blog = {
    ...blog,
    id: `blog-${Date.now()}`,
    slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    publishedAt: new Date().toISOString().split('T')[0],
  };

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('blogs').insertOne(newBlog);
    }
  } catch (err) {
    console.warn('MongoDB saveBlog error:', err);
  }

  const blogs = readJson<Blog[]>(blogsPath, []);
  blogs.unshift(newBlog);
  writeJson(blogsPath, blogs);
  return newBlog;
}

export async function updateBlog(id: string, updated: Partial<Blog>): Promise<Blog | null> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('blogs').updateOne({ id }, { $set: updated });
      const found = await db.collection('blogs').findOne({ id });
      if (found) {
        const { _id, ...b } = found as any;
        return b as Blog;
      }
    }
  } catch (err) {
    console.warn('MongoDB updateBlog error:', err);
  }

  const blogs = readJson<Blog[]>(blogsPath, []);
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;
  blogs[index] = { ...blogs[index], ...updated };
  writeJson(blogsPath, blogs);
  return blogs[index];
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('blogs').deleteOne({ id });
    }
  } catch (err) {
    console.warn('MongoDB deleteBlog error:', err);
  }

  const blogs = readJson<Blog[]>(blogsPath, []);
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length === blogs.length) return false;
  writeJson(blogsPath, filtered);
  return true;
}

// ==================== STATS & CONFIG ====================
export async function getStats(): Promise<SiteStats> {
  const defaultPassword = getDefaultAdminPassword();
  const defaultStats: SiteStats = {
    purchaseInquiries: 0,
    courseViews: 0,
    blogReads: 0,
    telegramUsername: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'Seed_Skill',
    adminPin: defaultPassword,
  };

  try {
    const db = await getMongoDatabase();
    if (db) {
      const doc = await db.collection('stats').findOne({ id: 'main_config' });
      if (doc) {
        return {
          purchaseInquiries: doc.purchaseInquiries ?? 0,
          courseViews: doc.courseViews ?? 0,
          blogReads: doc.blogReads ?? 0,
          telegramUsername: doc.telegramUsername || defaultStats.telegramUsername,
          adminPin: doc.adminPin || defaultPassword,
        };
      } else {
        await db.collection('stats').updateOne(
          { id: 'main_config' },
          { $set: { id: 'main_config', ...defaultStats } },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.warn('MongoDB stats fetch failed:', err);
  }

  return readJson<SiteStats>(statsPath, defaultStats);
}

export async function recordPurchaseInquiry(): Promise<SiteStats> {
  const current = await getStats();
  current.purchaseInquiries += 1;

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('stats').updateOne(
        { id: 'main_config' },
        { $set: { purchaseInquiries: current.purchaseInquiries } },
        { upsert: true }
      );
    }
  } catch (err) {}

  writeJson(statsPath, current);
  return current;
}

export async function updateSettings(newSettings: Partial<SiteStats>): Promise<SiteStats> {
  const current = await getStats();
  const updated = { ...current, ...newSettings };

  // Sync new plain text password directly to .env and .env.local
  if (newSettings.adminPin) {
    syncPasswordToEnvFiles(newSettings.adminPin);
  }

  try {
    const db = await getMongoDatabase();
    if (db) {
      await db.collection('stats').updateOne({ id: 'main_config' }, { $set: updated }, { upsert: true });
    }
  } catch (err) {}

  writeJson(statsPath, updated);
  return updated;
}
