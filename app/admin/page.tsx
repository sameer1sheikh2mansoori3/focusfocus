'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Course, Blog } from '@/lib/data';
import {
  Shield,
  BookOpen,
  Send,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  LogOut,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Tag,
  Link2,
  FolderPlus,
  Lock,
  GraduationCap,
  Upload,
  Database,
  Cloud,
  Loader2,
  Key,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'categories' | 'blogs' | 'settings'>('overview');

  // Data states (Zero dummy data)
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');
  const [showInlineNewCategory, setShowInlineNewCategory] = useState<boolean>(false);
  const [stats, setStats] = useState<any>({
    purchaseInquiries: 0,
    telegramUsername: 'Seed_Skill',
    backendType: 'Local Database Engine',
    isCloudConnected: false,
    currentPlainPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Plaintext password inspection state
  const [showPlainPassword, setShowPlainPassword] = useState<boolean>(false);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // File upload state & Asset Mode
  const [posterMode, setPosterMode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // Course Modal state
  const [courseModalOpen, setCourseModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    headline: '',
    description: '',
    thumbnailUrl: '',
    previewVideoUrl: '',
    price: 499,
    originalPrice: 3499,
    category: '',
    instructor: 'Seed Skill Academy',
    duration: '24.0 total hours',
    lecturesCount: 80,
    level: 'All Levels',
    badge: 'Bestseller' as 'Bestseller' | 'Highest Rated' | 'Hot & New' | '',
    whatYouWillLearn: 'Hands-on practical curriculum\nDirect creator mentorship',
    featured: true,
  });

  // Blog Modal state
  const [blogModalOpen, setBlogModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    category: 'Guides',
    author: 'Instructor',
    readTime: '5 min read',
    featured: false,
  });

  // Settings form state (Old password verification required)
  const [newTelegramUser, setNewTelegramUser] = useState<string>('Seed_Skill');
  const [oldPasswordForm, setOldPasswordForm] = useState<string>('');
  const [newPasswordForm, setNewPasswordForm] = useState<string>('');
  const [settingsError, setSettingsError] = useState<string>('');
  
  // Backend config form state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>('');
  const [backendPinConfirm, setBackendPinConfirm] = useState<string>('');
  const [savingBackend, setSavingBackend] = useState<boolean>(false);

  // Check saved session
  useEffect(() => {
    const savedPin = localStorage.getItem('seed_skill_admin_pin');
    if (savedPin) {
      verifyPin(savedPin, false);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyPin = async (pin: string, isUserSubmit = true) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.authorized) {
        setIsAuthenticated(true);
        localStorage.setItem('seed_skill_admin_pin', pin);
        loadAllData(pin);
      } else {
        localStorage.removeItem('seed_skill_admin_pin');
        if (isUserSubmit) {
          setPinError(data.error || 'Incorrect Password. Check your .env file (ADMIN_PASSWORD).');
        }
      }
    } catch {
      if (isUserSubmit) {
        setPinError('Error connecting to auth server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    verifyPin(pinInput, true);
  };

  const handleLogout = () => {
    localStorage.removeItem('seed_skill_admin_pin');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const loadAllData = async (authedPin?: string) => {
    const pin = authedPin || localStorage.getItem('seed_skill_admin_pin') || '';
    try {
      setLoading(true);
      const [coursesRes, blogsRes, statsRes, catRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/blogs'),
        fetch('/api/stats', {
          headers: { 'x-admin-pin': pin },
        }),
        fetch('/api/categories'),
      ]);

      const coursesData = await coursesRes.json();
      const blogsData = await blogsRes.json();
      const statsData = await statsRes.json();
      const catData = await catRes.json();

      if (coursesData.success) setCourses(coursesData.data);
      if (blogsData.success) setBlogs(blogsData.data);
      if (catData.success) setCategories(catData.data);
      if (statsData.success) {
        setStats(statsData.data);
        setNewTelegramUser(statsData.data.telegramUsername || 'Seed_Skill');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // CATEGORY HANDLERS - STRICTLY RESTRICTED TO ADMIN
  const handleAddNewCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const currentPin = localStorage.getItem('seed_skill_admin_pin') || '';

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': currentPin,
        },
        body: JSON.stringify({ name: trimmed, adminPin: currentPin }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        setCourseForm((prev) => ({ ...prev, category: trimmed }));
        setNewCategoryInput('');
        setShowInlineNewCategory(false);
        showNotification(`Category "${trimmed}" created!`);
      } else {
        showNotification(data.error || 'Failed to create category');
      }
    } catch {
      showNotification('Error adding category');
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    const currentPin = localStorage.getItem('seed_skill_admin_pin') || '';

    try {
      const res = await fetch(`/api/categories?name=${encodeURIComponent(catName)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-pin': currentPin,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        showNotification(`Category "${catName}" deleted.`);
      } else {
        showNotification(data.error || 'Failed to delete category');
      }
    } catch {
      showNotification('Error deleting category');
    }
  };

  // UPLOAD POSTER / THUMBNAIL HANDLER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'course' | 'blog') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (target === 'course') {
          setCourseForm((prev) => ({ ...prev, thumbnailUrl: data.url }));
        } else {
          setBlogForm((prev) => ({ ...prev, coverImage: data.url }));
        }
        showNotification(`Poster uploaded successfully!`);
      } else {
        showNotification(data.error || 'Upload failed');
      }
    } catch {
      showNotification('Error uploading file.');
    } finally {
      setUploadingImage(false);
    }
  };

  // COURSE HANDLERS
  const openNewCourseModal = () => {
    setEditingCourse(null);
    setPosterMode('upload');
    setCourseForm({
      title: '',
      headline: '',
      description: '',
      thumbnailUrl: '',
      previewVideoUrl: '',
      price: 499,
      originalPrice: 3499,
      category: categories[0] || 'Web Development',
      instructor: 'Seed Skill Academy',
      duration: '24.0 total hours',
      lecturesCount: 80,
      level: 'All Levels',
      badge: 'Bestseller',
      whatYouWillLearn: 'Hands-on practical curriculum\nDirect creator mentorship',
      featured: true,
    });
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setPosterMode(course.thumbnailUrl?.startsWith('/uploads') ? 'upload' : 'url');
    setCourseForm({
      title: course.title,
      headline: course.headline || '',
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      previewVideoUrl: course.previewVideoUrl || '',
      price: course.price,
      originalPrice: course.originalPrice || course.price * 6,
      category: course.category,
      instructor: course.instructor,
      duration: course.duration,
      lecturesCount: course.lecturesCount || 10,
      level: course.level || 'All Levels',
      badge: course.badge || 'Bestseller',
      whatYouWillLearn: Array.isArray(course.whatYouWillLearn)
        ? course.whatYouWillLearn.join('\n')
        : (course.whatYouWillLearn || ''),
      featured: course.featured,
    });
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.thumbnailUrl) {
      showNotification('Please upload a course poster or provide an image URL!');
      return;
    }

    try {
      if (editingCourse) {
        const res = await fetch('/api/courses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCourse.id,
            ...courseForm,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Course updated successfully!');
          setCourseModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseForm),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('New Course published on store!');
          setCourseModalOpen(false);
          loadAllData();
        }
      }
    } catch {
      showNotification('Error saving course.');
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Course deleted.');
        loadAllData();
      }
    } catch {
      showNotification('Error deleting course.');
    }
  };

  // BLOG HANDLERS
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      summary: '',
      content: 'Write your guide or roadmap here...',
      coverImage: '',
      category: 'Guides',
      author: 'Instructor',
      readTime: '5 min read',
      featured: true,
    });
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      author: blog.author,
      readTime: blog.readTime,
      featured: blog.featured,
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const res = await fetch('/api/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBlog.id,
            ...blogForm,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Guide updated successfully!');
          setBlogModalOpen(false);
          loadAllData();
        }
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogForm),
        });
        const data = await res.json();
        if (data.success) {
          showNotification('New Learning Guide published!');
          setBlogModalOpen(false);
          loadAllData();
        }
      }
    } catch {
      showNotification('Error saving blog.');
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Article deleted.');
        loadAllData();
      }
    } catch {
      showNotification('Error deleting blog.');
    }
  };

  // SETTINGS & UNHASHED PASSWORD MANAGEMENT
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          currentPin: oldPasswordForm, // Old password verification
          telegramUsername: newTelegramUser,
          newPin: newPasswordForm ? newPasswordForm.trim() : undefined, // Plain text unhashed
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Settings and Password updated successfully!');
        if (newPasswordForm) {
          localStorage.setItem('seed_skill_admin_pin', newPasswordForm.trim());
          loadAllData(newPasswordForm.trim());
        } else {
          loadAllData();
        }
        setOldPasswordForm('');
        setNewPasswordForm('');
      } else {
        setSettingsError(data.error || 'Failed to update settings');
        showNotification(data.error || 'Failed to update settings');
      }
    } catch {
      setSettingsError('Error updating settings.');
      showNotification('Error updating settings.');
    }
  };

  // 1. PIN LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f7f9fa]">
        <div className="max-w-md w-full bg-white border border-[#d1d7dc] rounded-lg p-8 shadow-xl relative">
          <div className="w-14 h-14 rounded-md bg-[#a435f0] flex items-center justify-center mx-auto mb-4 text-white font-black text-2xl shadow-md">
            S
          </div>

          <h2 className="text-2xl font-extrabold text-center text-[#1c1d1f]">SeedSkill Instructor Portal</h2>
          <p className="text-xs text-center text-[#6a6f73] mt-1 mb-6">
            Enter your Instructor Password to manage courses and platform settings.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1c1d1f] mb-1.5">
                Instructor Password (Configured in .env)
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter ADMIN_PASSWORD (default: admin123)"
                  className="w-full bg-white border border-[#1c1d1f] rounded-md pl-4 pr-10 py-3 text-sm text-[#1c1d1f] focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-1"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6a6f73] mt-1.5">
                <span>Default in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">.env</code>: <strong className="text-[#1c1d1f]">admin123</strong></span>
                <button
                  type="button"
                  onClick={() => setPinInput('admin123')}
                  className="text-[#a435f0] hover:underline font-bold"
                >
                  Fill default
                </button>
              </div>
            </div>

            {pinError && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-md udemy-btn-primary font-bold text-sm shadow-sm"
            >
              Sign In to Instructor Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-xs text-[#a435f0] hover:underline font-bold">
              ← Return to Udemy Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED INSTRUCTOR DASHBOARD
  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#1c1d1f]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#d1d7dc] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#a435f0] text-white font-black flex items-center justify-center text-lg">
                S
              </div>
              <div>
                <h1 className="text-base font-extrabold text-[#1c1d1f] flex items-center gap-2">
                  <span>SeedSkill Instructor Studio</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#a435f0] border border-purple-200">
                    {stats.backendType || 'Active'}
                  </span>
                </h1>
                <p className="text-[11px] text-[#6a6f73]">Orders routing to @{stats.telegramUsername || 'Seed_Skill'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d1d7dc] text-xs font-bold text-[#1c1d1f] hover:bg-gray-50 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#a435f0]" />
                <span>Student View</span>
                <ExternalLink className="w-3 h-3 text-[#6a6f73]" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-md bg-[#1c1d1f] text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3 border-l-4 border-[#a435f0]">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#d1d7dc] pb-3 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === 'overview'
                ? 'bg-[#1c1d1f] text-white shadow-sm'
                : 'text-[#6a6f73] hover:text-[#1c1d1f] hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === 'courses'
                ? 'bg-[#1c1d1f] text-white shadow-sm'
                : 'text-[#6a6f73] hover:text-[#1c1d1f] hover:bg-gray-100'
            }`}
          >
            Manage Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-[#1c1d1f] text-white shadow-sm'
                : 'text-[#6a6f73] hover:text-[#1c1d1f] hover:bg-gray-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#a435f0]" />
            <span>Category Manager ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === 'blogs'
                ? 'bg-[#1c1d1f] text-white shadow-sm'
                : 'text-[#6a6f73] hover:text-[#1c1d1f] hover:bg-gray-100'
            }`}
          >
            Learning Guides ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
              activeTab === 'settings'
                ? 'bg-[#1c1d1f] text-white shadow-sm'
                : 'text-[#6a6f73] hover:text-[#1c1d1f] hover:bg-gray-100'
            }`}
          >
            Password & Settings
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6a6f73] uppercase tracking-wider">
                    Published Courses
                  </span>
                  <GraduationCap className="w-5 h-5 text-[#a435f0]" />
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-[#1c1d1f]">{courses.length}</span>
                  <p className="text-xs text-[#6a6f73] mt-0.5">Real courses published</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6a6f73] uppercase tracking-wider">
                    Course Categories
                  </span>
                  <Tag className="w-5 h-5 text-[#a435f0]" />
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-[#1c1d1f]">{categories.length}</span>
                  <p className="text-xs text-[#6a6f73] mt-0.5">Admin-only controlled</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6a6f73] uppercase tracking-wider">
                    Telegram Inquiries
                  </span>
                  <Send className="w-5 h-5 text-[#0088cc]" />
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-[#1c1d1f]">{stats.purchaseInquiries}</span>
                  <p className="text-xs text-[#6a6f73] mt-0.5">Leads to @{stats.telegramUsername}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6a6f73] uppercase tracking-wider">
                    Database Engine
                  </span>
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="mt-3">
                  <span className="text-sm font-extrabold text-emerald-700 block truncate">
                    {stats.backendType || 'MongoDB Atlas'}
                  </span>
                  <p className="text-xs text-[#6a6f73] mt-0.5">Persistent cloud cluster</p>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#1c1d1f] mb-1">Create Real Course</h3>
                  <p className="text-xs text-[#6a6f73] mb-4">
                    Upload poster directly or paste image URL. Set syllabus, price in ₹, hours, and badge.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('courses');
                    openNewCourseModal();
                  }}
                  className="w-full py-2.5 rounded-md udemy-btn-primary font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#1c1d1f] mb-1">Manage Categories</h3>
                  <p className="text-xs text-[#6a6f73] mb-4">
                    Strictly admin-only: Add custom categories to filter courses on the storefront.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="w-full py-2.5 rounded-md bg-[#1c1d1f] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Category Manager</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#1c1d1f] mb-1">Password & Settings</h3>
                  <p className="text-xs text-[#6a6f73] mb-4">
                    View your current unhashed password in plaintext or change it using your old password.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full py-2.5 rounded-md border border-[#1c1d1f] hover:bg-gray-50 text-[#1c1d1f] font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4 text-[#a435f0]" />
                  <span>View / Change Password</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE COURSES (Zero Dummy Data) */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#1c1d1f]">Course Catalog</h2>
                <p className="text-xs text-[#6a6f73]">
                  Publish real courses with custom posters, syllabus, and prices.
                </p>
              </div>
              <button
                onClick={openNewCourseModal}
                className="px-5 py-2.5 rounded-md udemy-btn-primary font-bold text-xs sm:text-sm flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>New Course</span>
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded border border-[#d1d7dc] p-8">
                <p className="text-[#1c1d1f] font-bold text-base mb-1">No courses published yet</p>
                <p className="text-xs text-[#6a6f73] mb-4">Zero dummy data. Click below to add your first real course!</p>
                <button
                  onClick={openNewCourseModal}
                  className="px-5 py-2 rounded udemy-btn-primary font-bold text-xs"
                >
                  + Add First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-md border border-[#d1d7dc] overflow-hidden flex flex-col justify-between p-4 shadow-sm"
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded overflow-hidden mb-3 bg-gray-100">
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#eceb98] text-[#3d3c0a] font-bold text-[10px]">
                          ₹{course.price}
                        </div>
                        {course.category && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                            {course.category}
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug">{course.title}</h3>
                      <p className="text-xs text-[#6a6f73] mt-1">{course.instructor}</p>
                      <p className="text-[11px] text-[#6a6f73] mt-1">{course.duration} • {course.lecturesCount || 0} lectures</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 mt-4 flex items-center justify-between">
                      <button
                        onClick={() => openEditCourseModal(course)}
                        className="px-3 py-1.5 rounded border border-[#d1d7dc] hover:border-[#1c1d1f] text-xs font-bold text-[#1c1d1f] flex items-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="px-3 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORY MANAGER (STRICTLY OWNER ONLY) */}
        {activeTab === 'categories' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-purple-100 text-[#a435f0] text-xs font-extrabold uppercase mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted: Only You Can Create Categories</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1c1d1f]">Master Category Manager</h2>
              <p className="text-xs text-[#6a6f73] mt-1">
                Zero public category creation. Only you as authenticated instructor can create, edit, or remove categories across the entire platform.
              </p>
            </div>

            {/* Add New Category Box */}
            <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#1c1d1f] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#a435f0]" />
                <span>Create New Course Category</span>
              </h3>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="e.g. Full-Stack Web, Python, Video Editing, AI..."
                  className="flex-1 bg-white border border-[#1c1d1f] rounded-md px-4 py-2.5 text-sm text-[#1c1d1f] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewCategory(newCategoryInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddNewCategory(newCategoryInput)}
                  className="px-6 py-2.5 rounded-md udemy-btn-primary font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>
            </div>

            {/* List of Active Categories */}
            <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#1c1d1f]">Current Live Categories ({categories.length})</h3>
              
              {categories.length === 0 ? (
                <p className="text-xs text-[#6a6f73]">No categories created yet. Type above to create your first category.</p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#f7f9fa] border border-[#d1d7dc] text-[#1c1d1f] text-xs font-bold"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-[#6a6f73] hover:text-rose-600 transition"
                        title="Delete category"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE BLOGS */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#1c1d1f]">Learning Guides & Articles</h2>
                <p className="text-xs text-[#6a6f73]">
                  Publish real tutorials and student roadmaps.
                </p>
              </div>
              <button
                onClick={openNewBlogModal}
                className="px-5 py-2.5 rounded-md udemy-btn-primary font-bold text-xs sm:text-sm flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Write Guide</span>
              </button>
            </div>

            {blogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded border border-[#d1d7dc] p-8">
                <p className="text-[#1c1d1f] font-bold text-base mb-1">No articles published yet</p>
                <p className="text-xs text-[#6a6f73] mb-4">Zero dummy blogs. Click below to write a real guide.</p>
                <button
                  onClick={openNewBlogModal}
                  className="px-5 py-2 rounded udemy-btn-primary font-bold text-xs"
                >
                  + Write First Guide
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white p-5 rounded-lg border border-[#d1d7dc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-100 flex items-center justify-center text-[#6a6f73]">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#a435f0]">
                            {blog.category}
                          </span>
                          <span className="text-[11px] text-[#6a6f73]">{blog.publishedAt}</span>
                        </div>
                        <h3 className="font-bold text-[#1c1d1f] text-base leading-snug">{blog.title}</h3>
                        <p className="text-xs text-[#6a6f73] line-clamp-1 mt-1">{blog.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => openEditBlogModal(blog)}
                        className="px-3 py-2 rounded border border-[#d1d7dc] hover:border-[#1c1d1f] text-[#1c1d1f] text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog.id, blog.title)}
                        className="p-2 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PASSWORD & SETTINGS (Unhashed, Plaintext inspection & Old Password Verification) */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-[#1c1d1f]">Password & Platform Settings</h2>
              <p className="text-xs text-[#6a6f73] mt-1">
                Password is unhashed (plaintext) so you can view it. To change password, your old/current password must match.
              </p>
            </div>

            {/* View Current Plaintext Password Box */}
            <div className="bg-white p-6 rounded-lg border border-[#d1d7dc] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1d1f] flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#a435f0]" />
                    <span>Your Current Password (Unhashed / Plaintext)</span>
                  </h3>
                  <p className="text-xs text-[#6a6f73] mt-0.5">
                    Loaded from <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">.env.local</code> (ADMIN_PASSWORD).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPlainPassword(!showPlainPassword)}
                  className="px-3 py-1.5 rounded border border-[#d1d7dc] hover:border-[#1c1d1f] text-xs font-bold text-[#1c1d1f] flex items-center gap-1.5 transition"
                >
                  {showPlainPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPlainPassword ? 'Hide Password' : 'Show Password'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-[#f7f9fa] rounded border border-gray-200 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-[#1c1d1f] tracking-wider">
                  {showPlainPassword
                    ? (stats.currentPlainPassword || localStorage.getItem('seed_skill_admin_pin') || 'admin123')
                    : '••••••••••••'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Plaintext Active
                </span>
              </div>
            </div>

            {/* Change Password & Telegram Form (Old password verification required!) */}
            <form onSubmit={handleUpdateSettings} className="bg-white p-6 sm:p-8 rounded-lg border border-[#d1d7dc] space-y-6 shadow-sm">
              <h3 className="text-base font-extrabold text-[#1c1d1f]">Update Credentials</h3>

              {settingsError && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1.5">
                  Telegram Username (Receiving Student Orders)
                </label>
                <div className="flex items-center">
                  <span className="bg-[#f7f9fa] border border-r-0 border-[#d1d7dc] rounded-l px-3 py-2 text-sm text-[#6a6f73]">
                    @
                  </span>
                  <input
                    type="text"
                    value={newTelegramUser}
                    onChange={(e) => setNewTelegramUser(e.target.value)}
                    required
                    className="flex-1 bg-white border border-[#d1d7dc] rounded-r px-4 py-2 text-sm text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                  />
                </div>
                <p className="text-[11px] text-[#6a6f73] mt-1.5">
                  Links to: <code className="text-[#0088cc] font-bold">https://t.me/{newTelegramUser}</code>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <h4 className="text-sm font-bold text-[#1c1d1f]">Change Password (Old password required)</h4>

                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1.5">
                    Enter Old / Current Password *
                  </label>
                  <input
                    type="text"
                    value={oldPasswordForm}
                    onChange={(e) => setOldPasswordForm(e.target.value)}
                    placeholder="Type your current password to verify..."
                    required
                    className="w-full bg-white border border-[#1c1d1f] rounded px-4 py-2 text-sm text-[#1c1d1f] font-mono focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                  />
                  <p className="text-[11px] text-[#6a6f73] mt-1">
                    Security check: You cannot change password unless your old password is correct.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1.5">
                    Enter New Plaintext Password (Optional - leave blank if not changing)
                  </label>
                  <input
                    type="text"
                    value={newPasswordForm}
                    onChange={(e) => setNewPasswordForm(e.target.value)}
                    placeholder="Enter new plaintext password..."
                    className="w-full bg-white border border-[#d1d7dc] rounded px-4 py-2 text-sm text-[#1c1d1f] font-mono focus:outline-none focus:border-[#a435f0]"
                  />
                  <p className="text-[11px] text-[#6a6f73] mt-1">
                    Will be stored unhashed and visible so you can inspect it anytime.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded udemy-btn-primary font-bold text-sm shadow-sm"
              >
                Save Credentials
              </button>
            </form>

          </div>
        )}

      </main>

      {/* COURSE CREATE / EDIT MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8 bg-white rounded-lg border border-[#d1d7dc] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setCourseModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6a6f73] hover:text-[#1c1d1f]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[#1c1d1f] mb-1">
              {editingCourse ? 'Edit Course Details' : 'Publish Real Course'}
            </h3>
            <p className="text-xs text-[#6a6f73] mb-6">
              Upload poster or paste image URL. Orders will go to @{stats.telegramUsername} on Telegram.
            </p>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Course Title *</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Masterclass Course Title"
                  required
                  className="w-full bg-white border border-[#1c1d1f] rounded px-4 py-2 text-sm text-[#1c1d1f] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Subtitle / Headline *</label>
                <input
                  type="text"
                  value={courseForm.headline}
                  onChange={(e) => setCourseForm({ ...courseForm, headline: e.target.value })}
                  placeholder="One sentence description of what students will achieve"
                  required
                  className="w-full bg-white border border-[#d1d7dc] rounded px-4 py-2 text-xs text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                />
              </div>

              {/* Price, Original Price, and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Selling Price (₹ INR) *</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    placeholder="499"
                    required
                    className="w-full bg-white border border-[#d1d7dc] rounded px-4 py-2 text-sm text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Original Price (₹ Strikethrough)</label>
                  <input
                    type="number"
                    value={courseForm.originalPrice}
                    onChange={(e) => setCourseForm({ ...courseForm, originalPrice: Number(e.target.value) })}
                    placeholder="3499"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-4 py-2 text-sm text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#1c1d1f]">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                      className="text-[11px] text-[#a435f0] hover:underline font-bold flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showInlineNewCategory ? 'List' : '+ New'}</span>
                    </button>
                  </div>

                  {showInlineNewCategory ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="New category..."
                        className="flex-1 bg-white border border-[#a435f0] rounded px-2.5 py-1.5 text-xs text-[#1c1d1f] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewCategory(newCategoryInput)}
                        className="px-2.5 py-1.5 bg-[#a435f0] text-white font-bold text-xs rounded"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* POSTER / THUMBNAIL SOURCE: TWO CHOICES (Upload Poster OR Paste URL) */}
              <div className="space-y-3 bg-[#f7f9fa] p-4 rounded-md border border-[#d1d7dc]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1c1d1f]">
                    Course Poster / Thumbnail Source
                  </label>

                  <div className="flex rounded border border-[#d1d7dc] bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setPosterMode('upload')}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        posterMode === 'upload' ? 'bg-[#1c1d1f] text-white' : 'text-[#6a6f73] hover:text-[#1c1d1f]'
                      }`}
                    >
                      Upload Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => setPosterMode('url')}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        posterMode === 'url' ? 'bg-[#1c1d1f] text-white' : 'text-[#6a6f73] hover:text-[#1c1d1f]'
                      }`}
                    >
                      Paste URL
                    </button>
                  </div>
                </div>

                {/* Option 1: File Upload */}
                {posterMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, 'course')}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#d1d7dc] hover:border-[#a435f0] rounded-md p-6 text-center cursor-pointer bg-white transition"
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="w-7 h-7 animate-spin text-[#a435f0] mb-1.5" />
                          <p className="text-xs font-bold text-[#a435f0]">Uploading course poster...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-7 h-7 text-[#a435f0] mb-1" />
                          <p className="text-xs font-bold text-[#1c1d1f]">Click to upload course poster from device</p>
                          <p className="text-[11px] text-[#6a6f73]">Recommended: 16:9 ratio (1280x720 or 1920x1080)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Option 2: Image URL */}
                {posterMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={courseForm.thumbnailUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or direct image link"
                      className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                    />
                  </div>
                )}

                {/* Poster Live Preview */}
                {courseForm.thumbnailUrl && (
                  <div className="mt-2 relative aspect-video rounded overflow-hidden bg-gray-100 border border-[#d1d7dc]">
                    <img src={courseForm.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                      Poster Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Course Meta: Duration, Lectures, Level, Badge */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1c1d1f] mb-1">Total Hours</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="24.0 total hours"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-1.5 text-xs text-[#1c1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1c1d1f] mb-1">Lectures Count</label>
                  <input
                    type="number"
                    value={courseForm.lecturesCount}
                    onChange={(e) => setCourseForm({ ...courseForm, lecturesCount: Number(e.target.value) })}
                    placeholder="80"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-1.5 text-xs text-[#1c1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1c1d1f] mb-1">Skill Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full bg-white border border-[#d1d7dc] rounded px-2 py-1.5 text-xs text-[#1c1d1f]"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1c1d1f] mb-1">Udemy Badge</label>
                  <select
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value as any })}
                    className="w-full bg-white border border-[#d1d7dc] rounded px-2 py-1.5 text-xs text-[#1c1d1f]"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Hot & New">Hot & New</option>
                    <option value="">None</option>
                  </select>
                </div>
              </div>

              {/* What You'll Learn (Checklist) */}
              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">
                  What Students Will Learn (One point per line)
                </label>
                <textarea
                  rows={3}
                  value={courseForm.whatYouWillLearn}
                  onChange={(e) => setCourseForm({ ...courseForm, whatYouWillLearn: e.target.value })}
                  placeholder="Hands-on practical curriculum&#10;Direct creator mentorship"
                  className="w-full bg-white border border-[#d1d7dc] rounded p-3 text-xs text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                />
              </div>

              {/* Course Drive Link (Fulfillment) */}
              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span>Course Video Drive / Mega Link (Sent to student upon Telegram payment)</span>
                </label>
                <input
                  type="url"
                  value={courseForm.previewVideoUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, previewVideoUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/... or mega folder"
                  className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f] focus:outline-none focus:border-[#a435f0]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-5 py-2.5 rounded border border-[#d1d7dc] text-xs font-bold text-[#1c1d1f] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded udemy-btn-primary font-bold text-xs shadow-sm"
                >
                  {editingCourse ? 'Save Changes' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8 bg-white rounded-lg border border-[#d1d7dc] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6a6f73] hover:text-[#1c1d1f]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-[#1c1d1f] mb-1">
              {editingBlog ? 'Edit Guide' : 'Publish Guide'}
            </h3>
            <p className="text-xs text-[#6a6f73] mb-6">
              Write tutorials and career roadmaps for students.
            </p>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Article Title *</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Full-Stack Developer Guide"
                  required
                  className="w-full bg-white border border-[#1c1d1f] rounded px-4 py-2 text-sm text-[#1c1d1f] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Category</label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    placeholder="Guides"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="Instructor"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f]"
                  />
                </div>
              </div>

              {/* Cover Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1c1d1f]">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={blogFileInputRef}
                    onChange={(e) => handleFileUpload(e, 'blog')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => blogFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded border border-[#d1d7dc] hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#a435f0]" />
                    <span>Upload Cover</span>
                  </button>

                  <input
                    type="text"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Short engaging teaser..."
                  className="w-full bg-white border border-[#d1d7dc] rounded px-3 py-2 text-xs text-[#1c1d1f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c1d1f] mb-1">
                  Full Article Content (Markdown / paragraphs supported) *
                </label>
                <textarea
                  rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write your article here..."
                  required
                  className="w-full bg-white border border-[#d1d7dc] rounded p-4 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-5 py-2.5 rounded border border-[#d1d7dc] text-xs font-bold text-[#1c1d1f] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded udemy-btn-primary font-bold text-xs"
                >
                  {editingBlog ? 'Update Guide' : 'Publish Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
