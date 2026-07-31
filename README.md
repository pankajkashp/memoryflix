<div align="center">

# 🎬 MemoryFlix

**Turn Your Memories Into Cinematic Stories**

A premium SaaS platform that transforms personal photos and videos into beautifully presented, Netflix-style cinematic memory albums — create, preview, pay, and share unforgettable moments.

</div>

---

## ✨ Overview

MemoryFlix lets users build cinematic digital memory albums inspired by Netflix and Apple Memories. Users choose a template, structure their story into chapters, upload media, preview it in a Netflix-style playback experience, complete payment, and share it with a secure link.

**Core flow:**

```
Choose Template → Create Story → Add Chapters → Upload Media 
→ Assign Media to Chapters → Cinematic Preview → Payment 
→ Generate Share Link → Share Memories
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS, GSAP, shadcn/ui |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Auth** | Auth.js (NextAuth), Credentials Provider + bcrypt |
| **Payments** | Razorpay |
| **Media Storage** | Cloudinary |

---

## 📦 Features

### ✅ Completed
- Project architecture & responsive layout
- Authentication (JWT-based sessions)
- Dashboard, Story CRUD, Chapter CRUD
- Media upload & chapter assignment
- Netflix-style story preview
- Draft / Publish workflow + Continue Editing
- Razorpay payment integration

### 🔧 In Progress
- Code cleanup (dead code, unused imports, folder structure)
- Security hardening (auth audit, authorization checks, rate limiting, upload validation)
- Performance optimization (bundle size, image/video delivery, query efficiency)
- Cinematic story playback redesign (dynamic layouts, Ken Burns, background music)
- Full mobile responsiveness across all breakpoints
- Payment audit (server-side verification, duplicate prevention, share-link expiry)

### 🔮 Planned (v2.0+)
- AI-generated story titles, captions, and chapter suggestions
- AI music recommendation
- QR code sharing, guestbook & reactions
- Timeline view & memory map
- Video export (MP4)
- Time capsule stories
- Real-time collaboration

---

## 🗺️ Roadmap to v1.0

1. Finish Cleanup
2. Security Hardening
3. Performance Optimization
4. Story Playback Redesign
5. Payment Audit
6. Testing (unit, API, auth, payment)
7. Deployment (Vercel, custom domain, monitoring)

---

## 🗄️ Data Model

Core Prisma models:

- **User** — accounts, roles, auth credentials
- **Story** — top-level memory album (draft/published, payment status, template)
- **Chapter** — sections within a story (layout, music, cover media)
- **MediaAsset** — uploaded photos/videos, assignable to chapters
- **StoryTemplate** — reusable story templates
- **Payment** — Razorpay order/payment tracking

---

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) instance)
- Cloudinary account
- Razorpay account (test/live keys)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd memoryflix

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run Migrations & Dev Server

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

App runs at `http://localhost:3000`.

---

## 🔐 Security Notes

This project follows an active security hardening process. Current focus areas:

- Server-side Razorpay signature verification (never trust client callbacks)
- Per-resource authorization checks on every API route
- Signed, expiring share links
- Rate limiting on auth & payment routes
- Upload validation (file type, size)
- Zod validation on all API inputs
- Security headers (CSP, HSTS, X-Frame-Options)

---

## 📱 Design Principles

- **Dark-first cinematic theme** — high contrast for media-forward content
- **Consistent motion system** — unified GSAP easing/duration across the app
- **Mobile-first responsiveness** — dedicated breakpoints for small mobile, standard mobile, tablet, and desktop
- **Layout-aware story compositions** — dynamic multi-media chapter layouts (hero, grid, stack, picture-in-picture) instead of single-photo slideshows

---

## 📄 License

Proprietary — All rights reserved.

---

<div align="center">

**Every memory tells a story.**

</div>
