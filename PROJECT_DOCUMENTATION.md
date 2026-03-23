# Weather Dashboard Project - Complete Documentation

## 📋 Project Overview

**Project Name:** Real-Time Weather Dashboard  
**Tech Stack:** Next.js 15, Node.js/Express, MongoDB, Tailwind CSS, TypeScript  
**Purpose:** A production-ready weather forecasting application for monitoring real-time weather conditions and forecasts, primarily focused on Nepal region but capable of worldwide city search.

---

## 🎯 What This Project Does

This weather dashboard provides:
1. **Real-time weather data** for any city worldwide
2. **7-day weather forecasts** with detailed breakdowns
3. **Hourly predictions** for the next 24-48 hours
4. **Current conditions** including temperature, humidity, wind, pressure
5. **GPS location tracking** - automatically detects your location
6. **Auto-refresh** - updates weather data every 2 minutes
7. **Admin panel** - for managing weather data

---

## 🏗️ Architecture

### Frontend (weather-frontend)
- **Next.js 15** with App Router
- **React 18** for UI components
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
- **Framer Motion** for animations
- **Lucide React** for icons
- **Chart.js** for data visualization

### Backend (backend)
- **Node.js** runtime
- **Express.js** web framework
- **MongoDB** database with Mongoose
- **RESTful API** for all operations

### Data Flow
```
User → Frontend (Next.js) → API Calls → Backend (Express) → MongoDB
                                    ↓
                              Open-Meteo API
                              (External Weather Source)
```

---

## 📱 Pages & Features

### 1. Dashboard (`/dashboard`)
**Purpose:** Main landing page showing weather for your location

**Features:**
- GPS-based location detection
- Auto-refresh every 2 minutes
- Toggle button to enable/disable auto-refresh
- Shows last updated timestamp
- Primary weather card with main conditions
- Sidebar with additional details (humidity, wind, pressure)
- Multiple location cards

**How to use:**
- On first visit, it asks for location permission
- If granted, shows weather for your current coordinates
- If denied, defaults to Kathmandu
- Click refresh button for manual update

---

### 2. Forecast Page (`/forecast`)
**Purpose:** Detailed weather predictions for planning

**Features:**
- Search any city worldwide
- "Use My Location" button for GPS tracking
- 7-day forecast display
- Hourly forecast for 24-48 hours
- Current weather conditions
- Weather details (UV index, visibility, sunrise/sunset)
- Auto-refresh every 2 minutes

**How to use:**
- Type city name and search
- Or click "Use My Location" for current position
- View hourly and daily predictions below

---

### 3. Current Weather (`/current-weather`)
**Purpose:** Detailed real-time weather conditions

**Features:**
- Real-time temperature, feels-like, min/max temps
- Humidity percentage
- Wind speed and direction
- Pressure levels
- Weather condition with description
- Admin panel for data management

**How to use:**
- Automatically loads Kathmandu weather
- Can manually refresh or enable auto-refresh

---

### 4. Locations (`/locations`)
**Purpose:** Manage saved weather locations

**Features:**
- Add new locations
- View all saved locations
- Delete locations
- Click to view weather for any saved location

---

### 5. Temperature Stats (`/temperature-stats`)
**Purpose:** Analytics and charts

**Features:**
- Temperature trend charts
- Weather statistics
- Data visualization with Chart.js

---

### 6. Admin Panel (`/admin`)
**Purpose:** Manage all weather data in the system

**Features:**
- **Infrastructure Tab:** View system status
- **Locations Tab:** CRUD for locations
- **Forecasts Tab:** CRUD for forecasts
- **Hourly Tab:** Manage hourly forecast data
- Add new weather data entries
- Edit existing records
- Delete records

**Access:**
- URL: `/admin` or `/admin/login`
- Password: `admin123`

---

## ⚙️ Technical Features Explained

### Auto-Refresh System
```typescript
// Refresh interval: 2 minutes
const REFRESH_INTERVAL = 2 * 60 * 1000;

// Uses setInterval for automatic updates
intervalRef.current = setInterval(() => {
  loadData();
}, REFRESH_INTERVAL);
```

**Purpose:** Keeps weather data current without manual refresh
**How it works:** Sets a timer that triggers data reload every 2 minutes

---

### GPS Location Tracking
```javascript
// Browser API for geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    // Use position.coords.latitude and position.coords.longitude
  },
  (error) => {
    // Handle error - fallback to default location
  }
);
```

**Purpose:** Automatically detect user's location for local weather
**How it works:**
1. Request browser location permission
2. If granted, get coordinates
3. Fetch weather using coordinates instead of city name
4. Display "Your Location" indicator

---

### API Integration

#### Frontend → Backend Communication
```javascript
// Using Axios
const response = await axios.get(`${API_URL}/weather?lat=${lat}&lon=${lon}`);
```

#### Backend → External API
```javascript
// Open-Meteo API for weather data
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m`;
```

---

## 🔐 Authentication

**Admin Login:**
- Endpoint: `POST /api/auth/login`
- Password: `admin123`
- Token stored in localStorage

**Security Note:** In production, implement JWT tokens and proper password hashing

---

## 📊 Database Schema

### Weather Collection
```javascript
{
  city: String,
  country: String,
  coordinates: { lat: Number, lon: Number },
  weather: [{ id: Number, main: String, description: String, icon: String }],
  main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
  wind: { speed, deg },
  dt: Date timestamp,
  cod: Number
}
```

### Location Collection
```javascript
{
  name: String,
  lat: Number,
  lon: Number,
  region: String
}
```

### Forecast Collection
```javascript
{
  city: String,
  date: Date,
  temperature: Number,
  weather: String,
  description: String,
  icon: String
}
```

### HourlyForecast Collection
```javascript
{
  city: String,
  date: String,
  hour: Number,
  temperature: Number,
  feels_like: Number,
  condition: String,
  humidity: Number,
  wind_speed: Number,
  clouds: Number
}
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Setup Backend
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/weather-dashboard
# ADMIN_PASSWORD=admin123
npm run dev
```

### Step 2: Setup Frontend
```bash
cd weather-frontend
npm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

### Step 3: Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 💡 Key Features for Presentation

### For Interview/Presentation, Emphasize:

1. **Real-Time Updates**
   - "The dashboard automatically refreshes every 2 minutes"
   - "No need to manually refresh the page"

2. **GPS Integration**
   - "Automatically detects user location"
   - "Shows local weather without searching"

3. **Full-Stack Architecture**
   - "Built with Next.js frontend and Node.js/Express backend"
   - "MongoDB for persistent data storage"

4. **Admin Panel**
   - "Complete CRUD operations for weather management"
   - "Can add/edit/delete locations, forecasts, hourly data"

5. **Modern UI**
   - "Clean, responsive design"
   - "Smooth animations with Framer Motion"
   - "Glassmorphism visual effects"

6. **API Integration**
   - "Uses Open-Meteo API for weather data"
   - "Free, no API key required"

---

## 📝 Summary of Changes Made

| Feature | Purpose | Files Modified |
|---------|---------|----------------|
| Auto-refresh (2 min) | Keep data current | dashboard, forecast, current-weather pages |
| GPS Location | Auto-detect user location | forecast page, weatherApi.ts |
| Level 1/2 Features | Organize project features | README.md |
| Admin Management | CRUD for all data types | admin page |
| Real-time indicator | Show update status | DashboardHeader component |

---

## 🎓 Explanation for Others

When asked about this project, you can say:

> "I built a complete full-stack weather dashboard using Next.js, Node.js, and MongoDB. The application provides real-time weather data with auto-refresh capabilities, GPS location detection, and a comprehensive admin panel for data management. It features a modern UI with responsive design and smooth animations.

> Key technical aspects include:
> - Integrated Open-Meteo API for weather data
> - Implemented auto-refresh every 2 minutes using JavaScript setInterval
> - Used browser Geolocation API for GPS-based weather
> - Created RESTful API with Express.js
> - MongoDB for persistent data storage
> - TypeScript for type safety

> The project demonstrates full-stack development skills including API integration, state management, authentication, and modern UI design."

---

## 📂 Project Structure

```
weather-dashboard/
├── weather-frontend/        # Next.js application
│   ├── src/
│   │   ├── app/            # Pages (dashboard, forecast, etc.)
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # API client and utilities
│   └── package.json
│
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── package.json
│
└── README.md               # Project documentation
```

---

*This documentation is for personal reference. Do not push to GitHub.*