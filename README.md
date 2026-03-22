# Vastunirmana Construction Website

A professional full-stack construction company website with a complete Content Management System (CMS). Built as a pixel-perfect replica of dynaconprojects.com with advanced admin capabilities.

![Vastunirmana Website](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## 🌟 Features

### Public Website
- **Hero Slider** - Dynamic image carousel with customizable slides
- **Corporate Overview** - Company introduction and capabilities
- **About Us** - Detailed company history and values
- **Capabilities** - 12+ construction services showcase
- **Projects Portfolio** - Filterable by category (Industrial, Commercial, Institutional, Residential)
- **Client Showcase** - Esteemed clients logo display
- **Testimonials** - Client feedback carousel
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Professional Design** - Orange/Black color scheme with modern aesthetics

### Admin Dashboard (CMS)
- **Secure Authentication** - JWT-based login system
- **Dashboard Analytics** - Real-time statistics
- **Hero Slides Management** - Add, edit, delete, reorder slides with image upload
- **Capabilities Management** - Manage service offerings
- **Projects Management** - Full CRUD with category filtering
- **Clients Management** - Manage client logos and information
- **Testimonials Management** - Control customer testimonials
- **Contact Submissions** - View and manage inquiry forms
- **Company Info Management** - Edit company details, social links
- **Image Upload** - Built-in file upload system
- **Status Management** - Toggle active/inactive for all content

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - UI framework
- **React Router DOM 7.5.1** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **Shadcn UI** - Component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **FastAPI 0.110.1** - Python web framework
- **MongoDB (Motor)** - Database with async driver
- **Pydantic** - Data validation
- **JWT (python-jose)** - Authentication
- **Passlib + Bcrypt** - Password hashing
- **Python Multipart** - File uploads

### Database
- **MongoDB** - NoSQL database for flexible content management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **MongoDB** - Choose one:
  - Local installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Cloud) - [Free tier](https://www.mongodb.com/cloud/atlas/register)
- **Yarn** (recommended) or npm
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vastunirmana-website.git
cd vastunirmana-website
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
yarn install
# or
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create or update `/backend/.env`:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
# For MongoDB Atlas, use:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

DB_NAME=vastunirmana_db

# Security
SECRET_KEY=your-secret-key-change-in-production-12345678

# CORS (optional - defaults to all origins)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Frontend Environment Variables

Create or update `/frontend/.env`:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Development settings
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URL` in backend `.env`

### Seed Database (First Time Only)

The application automatically seeds initial data on first startup, including:
- 4 hero slides
- 12 capabilities
- 8 sample projects
- 10 client placeholders
- 3 testimonials
- Admin user (username: `admin`, password: `admin123`)
- Company information

To manually seed:
```bash
cd backend
python seed_db.py
```

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Backend will be available at: `http://localhost:8001`

API Documentation: `http://localhost:8001/docs`

### Start Frontend Development Server

```bash
cd frontend
yarn start
# or
npm start
```

Frontend will be available at: `http://localhost:3000`

## 🔐 Admin Access

### Default Admin Credentials

**⚠️ IMPORTANT: Change these credentials immediately after first login!**

**For initial setup only:**
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

**Security Note:** These default credentials are provided for initial setup only. You must change them immediately through the admin dashboard to secure your application.

### Admin Dashboard Features

Once logged in, you can access:

1. **Dashboard** - `/admin/dashboard` - Overview and statistics
2. **Hero Slides** - `/admin/hero-slides` - Manage homepage slider
3. **Capabilities** - `/admin/capabilities` - Manage services
4. **Projects** - `/admin/projects` - Manage portfolio
5. **Clients** - `/admin/clients` - Manage client logos
6. **Testimonials** - `/admin/testimonials` - Manage reviews
7. **Contacts** - `/admin/contacts` - View inquiries
8. **Company Info** - `/admin/company-info` - Edit company details

## 📁 Project Structure

```
vastunirmana-website/
├── frontend/
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   └── ...
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── *Management.jsx # CRUD pages
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── data/              # Mock data (for reference)
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env                   # Environment variables
│
├── backend/
│   ├── routes/
│   │   ├── public.py          # Public API endpoints
│   │   └── admin.py           # Admin API endpoints
│   ├── uploads/               # Uploaded files storage
│   ├── server.py              # FastAPI application
│   ├── models.py              # Pydantic models
│   ├── auth.py                # JWT authentication
│   ├── seed_db.py             # Database seeding
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── contracts.md               # API documentation
└── README.md                  # This file
```

## 📡 API Endpoints

### Public Endpoints (No Authentication)

- `GET /api/public/hero-slides` - Get active hero slides
- `GET /api/public/capabilities` - Get active capabilities
- `GET /api/public/projects?category=` - Get projects (filterable)
- `GET /api/public/clients` - Get active clients
- `GET /api/public/testimonials` - Get active testimonials
- `GET /api/public/company-info` - Get company information
- `POST /api/public/contact` - Submit contact form

### Admin Endpoints (Authentication Required)

All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

#### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current user

#### Content Management
- Hero Slides: `/api/admin/hero-slides` (GET, POST, PUT, DELETE)
- Capabilities: `/api/admin/capabilities` (GET, POST, PUT, DELETE)
- Projects: `/api/admin/projects` (GET, POST, PUT, DELETE)
- Clients: `/api/admin/clients` (GET, POST, PUT, DELETE)
- Testimonials: `/api/admin/testimonials` (GET, POST, PUT, DELETE)
- Contacts: `/api/admin/contacts` (GET, PUT, DELETE)
- Company Info: `/api/admin/company-info` (GET, PUT)

#### Utilities
- `POST /api/admin/upload` - Upload file (returns URL)
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

Full API documentation available at: `http://localhost:8001/docs`

## 🎨 Customization

### Change Color Scheme

Edit `/frontend/src/index.css`:

```css
:root {
  --primary-orange: #FF8C42;  /* Change to your brand color */
  --background: 0 0% 100%;
  /* ... other CSS variables */
}
```

### Update Company Information

1. Login to admin dashboard
2. Navigate to "Company Info"
3. Update all fields
4. Save changes

### Add New Content

Use the admin dashboard to add:
- New hero slides
- New projects
- New capabilities
- Client logos
- Testimonials

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   yarn build
   ```

2. Deploy `build/` folder to your hosting provider

3. Update environment variable:
   ```env
   REACT_APP_BACKEND_URL=https://your-backend-api.com
   ```

### Backend Deployment (Railway/Render/Heroku)

1. Ensure `requirements.txt` is up to date
2. Set environment variables on hosting platform
3. Use MongoDB Atlas for production database
4. Deploy with:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

### Environment Variables for Production

**Backend:**
- `MONGO_URL` - MongoDB Atlas connection string
- `SECRET_KEY` - Strong random secret key
- `DB_NAME` - Production database name
- `CORS_ORIGINS` - Your frontend domain

**Frontend:**
- `REACT_APP_BACKEND_URL` - Your backend API URL

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `ServerSelectionTimeoutError`
- Ensure MongoDB is running
- Check `MONGO_URL` in `.env`
- For MongoDB Atlas, whitelist your IP address

### CORS Errors

**Error:** `CORS policy blocked`
- Update `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is whitelisted

### Port Already in Use

**Error:** `Address already in use`
```bash
# Kill process on port 8001 (backend)
# Linux/Mac:
lsof -ti:8001 | xargs kill -9
# Windows:
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Import Errors

**Error:** `Module not found`
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

### Image Upload Not Working

- Check `/backend/uploads/` directory exists
- Ensure write permissions
- For production, consider cloud storage (AWS S3, Cloudinary)

## 📝 Development Notes

### Database Collections

- `hero_slides` - Homepage slider content
- `capabilities` - Company services/capabilities
- `projects` - Portfolio projects
- `clients` - Client information and logos
- `testimonials` - Customer testimonials
- `contact_submissions` - Contact form submissions
- `admin_users` - Admin accounts
- `company_info` - Company details

### File Upload System

Files are uploaded to `/backend/uploads/` and accessible via:
```
http://localhost:8001/api/uploads/<filename>
```

For production, implement cloud storage integration.

### Social Media Integration

The application supports 6 social media platforms:
- Facebook
- Twitter
- LinkedIn
- YouTube
- Instagram
- Quora

Social media links can be managed through the admin panel at `/admin/company-info`. Links are dynamically displayed in the footer only when configured.

## 🔒 Security Considerations

1. **Change Default Admin Password** - Immediately after first login
2. **Update SECRET_KEY** - Use strong random string in production
3. **Enable HTTPS** - Always use HTTPS in production
4. **Whitelist CORS** - Don't use `*` in production
5. **Environment Variables** - Never commit `.env` files to Git
6. **Rate Limiting** - Consider adding rate limiting for APIs
7. **Input Validation** - All inputs are validated via Pydantic models

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Vastunirmana Projects Pvt. Ltd.

## 👥 Credits

- **Design Inspiration:** dynaconprojects.com
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Framework:** [React](https://react.dev/) + [FastAPI](https://fastapi.tiangolo.com/)

## 📧 Support

For support and queries:
- **Email:** office@vastunirmana.com
- **Phone:** +91-8882906055
- **Website:** https://www.vastunirmana.com/

---

**Built with ❤️ for Vastunirmana Projects Pvt. Ltd.**

*Last Updated: March 2026*
