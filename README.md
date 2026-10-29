# SeedSkill - Udemy-Style Online Course Marketplace 🎓

A professional, commercial-grade online course platform inspired by **Udemy's clean UI & UX**, with direct Telegram enrollment (`@Seed_Skill`), Instructor Admin Suite, and admin-only category management.

---

## 🌟 What Makes It Look Like Udemy?

1. **Udemy Signature UI & Layout:**
   - Crisp white/light-gray background (`#ffffff` & `#f7f9fa`) with Udemy purple brand accents (`#a435f0`).
   - Sticky Udemy Header with wide search bar, "Categories" mega dropdown, and Instructor Portal link.
   - Billboard Promo Hero with floating callout card and Featured Course Spotlight.
   - Classic Udemy Course Cards:
     - 16:9 Thumbnail with duration overlay.
     - **Bestseller / Highest Rated / Hot & New** yellow badges (`#eceb98`).
     - Golden star ratings (e.g. `★ 4.9 (3,840 ratings)`).
     - Hours, lecture count, and skill level (`48.5 hours • 210 lectures • All Levels`).
     - Real pricing with strikethrough discount (e.g. `₹499` ~~₹3,499~~, 86% off!).
     - **Curriculum / Syllabus Modal**: Includes "What you'll learn" checklist with checkmarks, on-demand video specs, lifetime access & certificate notice.
     - **Enroll via Telegram**: 1-click redirect to `@Seed_Skill` on Telegram with prefilled course details.

2. **Strict Category Control (Admin Only):**
   - **Only the authenticated Instructor/Admin can create or delete categories.**
   - Protected API route (`/api/categories`) checks `x-admin-pin` to prevent unauthorized visitors from creating categories.
   - Admin has a dedicated **"Category Manager"** tab in the Instructor Portal.

3. **Two Flexible Ways to Add Course Posters:**
   - 📁 **Upload Poster from Device:** Choose image file directly from PC or mobile.
   - 🔗 **Paste Poster / Image URL:** Direct link from Unsplash, AWS S3, or external CDN.

4. **Instructor Admin Suite (`/admin`):**
   - **PIN Protected:** Default PIN: `admin123`.
   - Publish & edit courses with title, subtitle, price, hours, lectures, and bullet points.
   - Publish & edit Learning Guides & Career Roadmaps.
   - Connect Free Supabase Cloud Database (PostgreSQL) or run on local database engine.
   - Change Telegram handle and admin PIN.

---

## 🚀 How to Run

```bash
npm run dev
```

- **Student Storefront:** `http://localhost:3000`
- **Instructor Portal:** `http://localhost:3000/admin` *(Default PIN: `admin123`)*
# focusfocus
