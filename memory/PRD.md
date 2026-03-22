# Vastunirmana Construction Website - PRD

## Original Problem Statement
Build a construction website replica of dynaconprojects.com using the company name "Vastunirmana". Features include a full CMS backend, "send query" contact modal, working header logins, a live chat widget, Instagram/Quora social links, and a multi-page dynamic structure (About Us, Services, Contact Us with map, and Project categories: Residential, Commercial, Office, Retail) editable via the admin dashboard.

## User Personas
- **Public Visitors**: Browse company info, view projects, contact the company
- **Admin Users**: Manage all content via CMS dashboard (hero slides, capabilities, projects, clients, testimonials, company info, page content)

## Core Requirements
1. Multi-page website: Home, About Us, Services, Contact Us, Projects (4 categories)
2. Full CMS admin dashboard with CRUD for all content
3. Contact form (Send Query modal + Contact page form)
4. Live Chat widget
5. Social media links (Facebook, Twitter, LinkedIn, YouTube, Instagram, Quora)
6. Google Maps embed on Contact page
7. JWT-based admin authentication
8. Dynamic content from MongoDB

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, Pydantic v2, Motor (async MongoDB)
- **Database**: MongoDB
- **Auth**: JWT (python-jose, passlib/bcrypt)

## Architecture
```
/app
├── frontend/src/
│   ├── components/ (Navbar, Footer, HeroSlider, LiveChat, AdminLayout, ProtectedRoute, SectionHeader)
│   ├── context/ (AuthContext)
│   ├── pages/ (Home, AboutUs, Services, ContactUs, Projects[4], Admin[8 CMS pages])
│   └── services/ (api.js)
├── backend/
│   ├── routes/ (admin.py, public.py)
│   ├── models.py, server.py, auth.py, seed_db.py
```

## Admin Credentials
- Username: `admin`
- Password: `admin123`

## What's Been Implemented (Complete)
- [x] Frontend UI clone of dynaconprojects.com
- [x] MongoDB FastAPI Backend + JWT Auth
- [x] Admin CMS Dashboard (Hero, Capabilities, Projects, Clients, Testimonials, Company Info, Contacts, Pages)
- [x] Send Query contact modal & Login header routing
- [x] Floating Live Chat widget
- [x] Instagram & Quora social links in Footer
- [x] Multi-page routing (About Us, Services, Contact, Projects x4)
- [x] Google Maps embed on Contact page
- [x] PageContentManagement admin page
- [x] Backend Pydantic v2 cleanup (.model_dump(), datetime.now(timezone.utc))
- [x] **Project Gallery/Portfolio page** at /projects with:
  - Category filtering (All, Industrial, Commercial, Institutional, Residential) with counts
  - Grid view toggle (2/3 columns)
  - Full-screen lightbox with keyboard navigation (Arrow keys, Escape)
  - Project detail overlay on hover
  - Category links section
  - Updated Navbar dropdown with "All Projects" link
- [x] Comprehensive testing: Backend 100% (27/27), Frontend 100% (all features)

## Backlog / Future Tasks
- P1: Performance optimizations (lazy loading, image optimization)
- P2: SEO improvements (meta tags, structured data)
- P2: Break down PageContentManagement.jsx if more pages added
- P3: Admin password change functionality
