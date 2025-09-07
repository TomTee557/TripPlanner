# Trip Planner 🌍

A comprehensive web application for managing and organizing personal trips with user authentication, role-based access control, and responsive design.

## 📋 Table of Contents
- [Features](#-features)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Development](#-development)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure user registration with password hashing (bcrypt)
- **Role-Based Access Control**: USER and ADMIN roles with different permissions
- **Session Management**: Secure session handling with environment-aware HTTPS detection
- **Automatic Logout**: Inactivity timeout (30 minutes) with warning system

### 🎯 Trip Management
- **CRUD Operations**: Create, read, update, and delete personal trips
- **Advanced Filtering**: Filter trips by date range, country, trip type, title, and tags
- **Rich Trip Data**: Store title, dates, country, type, tags, budget, description, and images
- **Visual Gallery**: Pre-selected trip images with thumbnail selection

### 👥 User Management (Admin Only)
- **User Overview**: View all registered users
- **Role Management**: Change user roles (USER ↔ ADMIN)
- **Password Reset**: Admin can reset user passwords
- **User Deletion**: Remove users from the system

### 🎨 User Experience
- **Responsive Design**: Desktop and mobile-optimized interface
- **Real-time Clock**: Dynamic time display
- **Interactive UI**: Smooth popups, confirmations, and feedback messages
- **Search & Filter**: Advanced trip filtering with multiple criteria
- **Currency Converter**: Built-in currency conversion for budget planning

## 🚀 Demo

Default admin credentials:
- **Email**: `admin@admin.com`
- **Password**: `admin`

**Demo Users**:
- Admin: Full system access, user management capabilities
- Regular Users: Personal trip management only

## 📋 Prerequisites

- **Docker**: Version 20.0+
- **Docker Compose**: Version 3.0+
- **Web Browser**: Modern browser with JavaScript enabled

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TomTee557/TripPlanner.git
   cd TripPlanner
   ```

2. **Start the application with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:8080
   - **Database**: localhost:5433 (PostgreSQL)

4. **Initialize the database** (automatic)
   - Database and tables are created automatically
   - Default admin user is inserted on first run

## 💻 Usage

### Getting Started
1. Navigate to http://localhost:8080
2. **New users**: Click "Register" to create an account
3. **Existing users**: Login with your credentials
4. Start managing your trips!

### Managing Trips
1. **Add Trip**: Click "Add Trip" button, fill in details, select image
2. **View Trips**: Browse your trips in the main dashboard
3. **Filter Trips**: Use search form to filter by date, country, type, etc.
4. **Edit Trip**: Click edit icon on any trip card
5. **Delete Trip**: Click delete icon (with confirmation)

### Admin Features
1. **User Management**: Click "Manage Users" (admin only)
2. **Change Roles**: Promote users to admin or demote to regular user
3. **Reset Passwords**: Set new passwords for users
4. **Delete Users**: Remove users from the system

## 📚 API Documentation

### Authentication Endpoints
- `POST /login` - User login
- `POST /register` - User registration  
- `POST /logout` - User logout

### Trip Management API
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Add new trip
- `POST /api/trips/update` - Update existing trip
- `POST /api/trips/delete` - Delete trip

### User Management API (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users/role` - Update user role
- `POST /api/users/password` - Update user password
- `POST /api/users/delete` - Delete user

### Request/Response Examples

**Add Trip**:
```json
POST /api/trips
{
  "title": "Summer Vacation",
  "dateFrom": "2024-07-01",
  "dateTo": "2024-07-15",
  "country": "Italy",
  "tripType": ["exotic"],
  "tags": ["vacation", "summer"],
  "budget": "2000 USD",
  "description": "Two weeks in beautiful Italy"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Trip added successfully",
  "tripId": "uuid-here"
}
```

## 🏗️ Architecture

### Backend Architecture
- **MVC Pattern**: Model-View-Controller separation
- **Repository Pattern**: Data access abstraction
- **Front Controller**: Single entry point routing
- **Dependency Injection**: Loose coupling between components

### Frontend Architecture
- **Modular JavaScript**: ES6 modules with clear separation
- **Event-Driven**: Centralized event handling
- **API-First**: RESTful communication with backend
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Data Flow
1. **User Interaction** → Frontend JavaScript
2. **API Request** → Router → Controller
3. **Business Logic** → Repository → Database
4. **Response** → JSON → Frontend → UI Update

## 🔒 Security Features

### Session Security
- **HTTP-Only Cookies**: Protection against XSS
- **Secure Cookies**: HTTPS-only in production
- **Session Regeneration**: New session ID on login
- **Environment Detection**: Development vs production settings

### Data Protection
- **Password Hashing**: Bcrypt with salt
- **Prepared Statements**: SQL injection prevention
- **Input Validation**: Server-side data validation
- **Role-Based Authorization**: Access control by user role

### Session Management
- **Inactivity Timeout**: 30-minute automatic logout
- **Activity Tracking**: Mouse, keyboard, scroll, touch detection
- **Warning System**: 30-second warning before logout
- **Browser Close Detection**: Logout when browser/tab closes

## 🛠️ Technologies Used

### Backend
- **PHP 8+**: Server-side scripting
- **PostgreSQL**: Primary database
- **PDO**: Database abstraction layer
- **Bcrypt**: Password hashing

### Frontend  
- **Vanilla JavaScript (ES6+)**: No frameworks, pure JavaScript
- **CSS3**: Modern styling with Flexbox/Grid
- **HTML5**: Semantic markup
- **Fetch API**: HTTP requests

### Infrastructure
- **Docker & Docker Compose**: Containerization
- **Nginx**: Web server and reverse proxy
- **Multi-stage Builds**: Optimized Docker images

### Development Tools
- **Git**: Version control
- **VS Code**: Development environment
- **Chrome DevTools**: Debugging and profiling

## 📁 Project Structure

```
├── 📁 docker/                 # Docker configuration
│   ├── 📁 nginx/             # Nginx web server
│   ├── 📁 php/               # PHP-FPM container
│   └── 📁 db/                # PostgreSQL database
├── 📁 database/              # Database schema
│   └── init.sql              # Database initialization
├── 📁 src/                   # Backend PHP code
│   ├── 📁 controllers/       # MVC Controllers
│   ├── 📁 models/            # Data models
│   ├── 📁 repository/        # Data access layer
│   └── 📁 helpers/           # Utility classes
├── 📁 public/                # Frontend assets
│   ├── 📁 scripts/           # JavaScript modules
│   │   ├── 📁 infrastructure/  # API communication
│   │   └── 📁 helpers/         # Utility functions
│   ├── 📁 styles/            # CSS stylesheets
│   ├── 📁 views/             # HTML templates
│   └── 📁 assets/            # Images and media
├── docker-compose.yaml       # Docker orchestration
├── index.php                 # Application entry point
└── Routing.php               # URL routing system
```

## 🗃️ Database Schema

### Users Table
```sql
users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    surname VARCHAR(100), 
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Trips Table  
```sql
trips (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    date_from DATE,
    date_to DATE,
    country VARCHAR(100),
    trip_type JSONB,
    tags JSONB,
    budget VARCHAR(50),
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP
)
```

## 🚀 Development

### Local Development Setup

1. **Clone and setup**:
   ```bash
   git clone [repo-url]
   cd trip-planner
   docker-compose up -d
   ```

2. **Access development environment**:
   - Application: http://localhost:8080
   - Database: localhost:5433
   - Logs: `docker-compose logs -f`

3. **Development workflow**:
   - Edit files locally (hot reloading enabled)
   - Test in browser
   - Check logs with `docker-compose logs`

### Environment Configuration

**Development**:
- HTTP allowed for sessions
- Detailed error logging
- Hot reloading enabled

**Production**:
- HTTPS required for secure cookies
- Error logging to files
- Optimized Docker images

### Adding New Features

1. **Backend API**:
   - Add route in `index.php`
   - Create controller method
   - Add repository method if needed
   - Test with API client

2. **Frontend**:
   - Create JavaScript module
   - Add UI components
   - Connect to API
   - Add event handlers


**Built with ❤️ for efficient trip planning and management**

*For support or questions, please open an issue on GitHub.*
