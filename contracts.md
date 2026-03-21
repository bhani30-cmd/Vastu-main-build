# Backend & Frontend Integration Contracts

## Overview
Building a CMS backend for Vastunirmana Construction Website with MongoDB, allowing admin to manage all content through a dashboard.

## Database Collections

### 1. hero_slides
```python
{
    _id: ObjectId,
    title: str,
    subtitle: str,
    description: str,
    image: str (URL),
    order: int,
    is_active: bool,
    created_at: datetime,
    updated_at: datetime
}
```

### 2. capabilities
```python
{
    _id: ObjectId,
    title: str,
    image: str (URL),
    description: str (optional),
    order: int,
    is_active: bool,
    created_at: datetime,
    updated_at: datetime
}
```

### 3. projects
```python
{
    _id: ObjectId,
    title: str,
    category: str (Industrial/Commercial/Institutional/Residential),
    description: str,
    client: str,
    image: str (URL),
    is_featured: bool,
    is_active: bool,
    created_at: datetime,
    updated_at: datetime
}
```

### 4. clients
```python
{
    _id: ObjectId,
    name: str,
    logo: str (URL),
    order: int,
    is_active: bool,
    created_at: datetime,
    updated_at: datetime
}
```

### 5. testimonials
```python
{
    _id: ObjectId,
    name: str,
    position: str,
    company: str,
    logo: str (URL),
    quote: str,
    order: int,
    is_active: bool,
    created_at: datetime,
    updated_at: datetime
}
```

### 6. contact_submissions
```python
{
    _id: ObjectId,
    name: str,
    email: str,
    phone: str,
    subject: str,
    message: str,
    status: str (new/read/replied),
    created_at: datetime,
    updated_at: datetime
}
```

### 7. admin_users
```python
{
    _id: ObjectId,
    username: str (unique),
    email: str (unique),
    password: str (hashed),
    full_name: str,
    is_active: bool,
    created_at: datetime,
    last_login: datetime
}
```

### 8. company_info
```python
{
    _id: ObjectId,
    company_name: str,
    tagline: str,
    about_us: str,
    email: str,
    phone: str,
    address: str,
    established_year: int,
    iso_certifications: str,
    social_links: {
        facebook: str,
        twitter: str,
        linkedin: str,
        youtube: str
    },
    updated_at: datetime
}
```

## API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/public/hero-slides` - Get all active hero slides
- `GET /api/public/capabilities` - Get all active capabilities
- `GET /api/public/projects` - Get all active projects (with category filter)
- `GET /api/public/clients` - Get all active clients
- `GET /api/public/testimonials` - Get all active testimonials
- `GET /api/public/company-info` - Get company information
- `POST /api/public/contact` - Submit contact form

### Admin Authentication
- `POST /api/admin/login` - Admin login (returns JWT token)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin user

### Admin Protected Endpoints (Require Auth)
- **Hero Slides**
  - `GET /api/admin/hero-slides` - Get all
  - `POST /api/admin/hero-slides` - Create new
  - `PUT /api/admin/hero-slides/{id}` - Update
  - `DELETE /api/admin/hero-slides/{id}` - Delete

- **Capabilities**
  - `GET /api/admin/capabilities` - Get all
  - `POST /api/admin/capabilities` - Create new
  - `PUT /api/admin/capabilities/{id}` - Update
  - `DELETE /api/admin/capabilities/{id}` - Delete

- **Projects**
  - `GET /api/admin/projects` - Get all
  - `POST /api/admin/projects` - Create new
  - `PUT /api/admin/projects/{id}` - Update
  - `DELETE /api/admin/projects/{id}` - Delete

- **Clients**
  - `GET /api/admin/clients` - Get all
  - `POST /api/admin/clients` - Create new
  - `PUT /api/admin/clients/{id}` - Update
  - `DELETE /api/admin/clients/{id}` - Delete

- **Testimonials**
  - `GET /api/admin/testimonials` - Get all
  - `POST /api/admin/testimonials` - Create new
  - `PUT /api/admin/testimonials/{id}` - Update
  - `DELETE /api/admin/testimonials/{id}` - Delete

- **Contact Submissions**
  - `GET /api/admin/contacts` - Get all submissions
  - `PUT /api/admin/contacts/{id}` - Update status
  - `DELETE /api/admin/contacts/{id}` - Delete

- **Company Info**
  - `GET /api/admin/company-info` - Get company info
  - `PUT /api/admin/company-info` - Update company info

- **File Upload**
  - `POST /api/admin/upload` - Upload image (returns URL)

## Frontend Changes

### Mock Data to Replace (in mockData.js)
All data will be fetched from backend APIs instead of mock data:
- `heroSlides` → Fetch from `/api/public/hero-slides`
- `capabilities` → Fetch from `/api/public/capabilities`
- `projects` → Fetch from `/api/public/projects`
- `clients` → Fetch from `/api/public/clients`
- `testimonials` → Fetch from `/api/public/testimonials`

### New Pages to Create
1. **Admin Login** (`/admin/login`) - Login form
2. **Admin Dashboard** (`/admin/dashboard`) - Main dashboard with statistics
3. **Admin Content Management**
   - `/admin/hero-slides` - Manage hero slides
   - `/admin/capabilities` - Manage capabilities
   - `/admin/projects` - Manage projects
   - `/admin/clients` - Manage clients
   - `/admin/testimonials` - Manage testimonials
   - `/admin/contacts` - View contact submissions
   - `/admin/company-info` - Edit company info

### Authentication Flow
1. Admin logs in → JWT token stored in localStorage
2. Protected routes check for valid token
3. All admin API calls include token in Authorization header
4. Token expires after 24 hours → redirect to login

## Implementation Steps

### Backend (Python/FastAPI)
1. Create database models (Pydantic schemas)
2. Create authentication module (JWT, password hashing)
3. Create public API routes
4. Create admin API routes with auth middleware
5. Add file upload functionality
6. Seed initial admin user and mock data

### Frontend (React)
1. Create API service layer for backend calls
2. Build admin login page
3. Create admin layout with navigation
4. Build CRUD pages for each content type
5. Update public pages to fetch from API
6. Add loading states and error handling
7. Add image upload component

## Security Measures
- JWT token authentication
- Password hashing with bcrypt
- Protected admin routes
- CORS configured
- File upload validation
- Input validation on all endpoints

## Initial Admin Credentials (will be created)
- Username: admin
- Password: admin123 (should be changed after first login)
