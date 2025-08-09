# Trip Planner 🌍

Welcome to Trip planner project 💪!!!

## Features

- User authentication (login/register)
- Trip management and filtering
- Responsive design (desktop/mobile)
- Automated session management with security features

## Session Management System 🔐

The Trip Planner implements a comprehensive session management system with automatic logout capabilities to ensure user security and optimal user experience.

### Session Configuration

- **Session timeout**: 30 minutes of inactivity
- **Cookie lifetime**: Session cookies (expire when browser closes)
- **Security features**: HTTP-only cookies, strict session ID handling
- **Server-side cleanup**: Automatic garbage collection after 30 minutes

### Automatic Logout Mechanisms

#### 1. Inactivity Timeout
- **Detection**: Monitors user activity (mouse movements, clicks, keyboard, scroll, touch)
- **Warning**: Shows popup 30 seconds before logout
- **Timeout period**: 30 minutes of complete inactivity
- **Message**: "You have been logged out due to inactivity."

#### 2. Browser/Tab Close
- **Detection**: Uses `beforeunload` event and `sendBeacon` API
- **Action**: Immediate logout when browser or tab is closed
- **Message**: "You have been logged out."

#### 3. Server-side Validation
- **Check**: Validates session on every request to protected routes
- **Timeout**: Server-side timeout validation (30 minutes)
- **Activity tracking**: Updates `last_activity` timestamp on each request





## Installation & Setup

1. Clone the repository
2. Set up Docker environment: `docker-compose up -d`
3. Access the application at `http://localhost:8080`
4. Default login: `admin@admin.com` / `admin`

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+), CSS3, HTML5
- **Backend**: PHP 8+, Session management
- **Infrastructure**: Docker, Docker Compose, Nginx
