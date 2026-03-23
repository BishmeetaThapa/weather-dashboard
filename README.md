<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/cloud-sun.svg" width="80" height="80" alt="SkyCast Logo" />
  <h1>Real-Time Weather Dashboard</h1>
  <p>A modern, high-performance SaaS weather dashboard focused on the Nepal region, built with Next.js 15 and Node.js backend with MongoDB integration.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind-v4-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  </div>
</div>

---

## 🚀 Overview

**Weather Dashboard** is a production-ready weather forecasting application designed for professional monitoring and personal use. It delivers accurate, real-time weather metrics for **Kathmandu and major cities in Nepal**, with a full-stack backend for data management.

### 🌟 Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <b>📡 Real-Time Monitoring</b><br/>
      Live weather polling every 5 minutes with auto-refresh toggle.
    </td>
    <td width="50%">
      <b>📊 Analytical Charts</b><br/>
      Interactive temperature trend charts powered by Chart.js.
    </td>
  </tr>
  <tr>
    <td>
      <b>🌐 Full-Stack Backend</b><br/>
      Node.js/Express REST API with MongoDB for data persistence.
    </td>
    <td>
      <b>🛠️ Admin Dashboard</b><br/>
      Manage weather data, locations, forecasts, and hourly data.
    </td>
  </tr>
  <tr>
    <td>
      <b>📅 7-Day Forecast</b><br/>
      Detailed weekly breakdown with modern icons and precision metrics.
    </td>
    <td>
      <b>💧 Hourly Forecasts</b><br/>
      Hourly weather predictions for the next 24-48 hours.
    </td>
  </tr>
  <tr>
    <td>
      <b>🇳🇵 Nepal Regional Focus</b><br/>
      Pre-configured tracking for Kathmandu, Pokhara, and other major hubs.
    </td>
    <td>
      <b>📍 Location Management</b><br/>
      Full CRUD operations for saved locations with persistent backend.
    </td>
  </tr>
</table>

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Data**: [Axios](https://axios-http.com/) & React Hooks
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [React-Chartjs-2](https://react-chartjs-2.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **API**: [Open-Meteo](https://open-meteo.com/) (Free Weather API)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BishmeetaThapa/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install all dependencies**
   ```bash
   # Install frontend dependencies
   cd weather-frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Set up Environment Variables**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/weather-dashboard
   ADMIN_PASSWORD=admin123
   ```

   Create a `.env.local` file in the weather-frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the development servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd weather-frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

---

## 📁 Project Structure

```
weather-dashboard/
├── weather-frontend/          # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   │   ├── admin/        # Admin dashboard & login
│   │   │   ├── dashboard/    # Main weather dashboard
│   │   │   ├── forecast/     # 7-day forecast page
│   │   │   ├── current-weather/  # Current weather
│   │   │   ├── locations/    # Location management
│   │   │   └── temperature-stats/ # Temperature analytics
│   │   ├── components/       # Reusable UI & Weather Widgets
│   │   └── lib/              # API Clients & Utilities
│   └── package.json
│
├── backend/                   # Node.js/Express Backend
│   ├── controllers/           # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── middleware/           # Custom middleware
│   ├── db/                   # Database connection
│   └── package.json
│
└── README.md
```

---

## 📱 Pages Overview

| Page | Description |
|------|-------------|
| `/dashboard` | Main dashboard with current weather, GPS location, and auto-refresh |
| `/forecast` | 7-day forecast with hourly breakdown |
| `/current-weather` | Detailed current weather with admin panel |
| `/locations` | Manage saved locations |
| `/temperature-stats` | Temperature analytics and charts |
| `/admin` | Admin panel for managing all weather data |
| `/settings` | Application settings |

---

## 🔧 API Endpoints

### Weather
- `GET /api/weather` - Get all weather data
- `GET /api/weather?lat=X&lon=Y` - Get weather by coordinates
- `POST /api/weather` - Create weather data
- `PUT /api/weather/:id` - Update weather data
- `DELETE /api/weather/:id` - Delete weather data

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Add new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Forecasts
- `GET /api/forecast` - Get all forecasts
- `GET /api/forecast/:city` - Get forecast by city
- `POST /api/forecast` - Create forecast

### Hourly Forecasts
- `GET /api/hourly-forecast` - Get all hourly forecasts
- `GET /api/hourly-forecast/city?city=NAME` - Get hourly forecast by city
- `POST /api/hourly-forecast` - Create hourly forecast
- `PUT /api/hourly-forecast/:id` - Update hourly forecast
- `DELETE /api/hourly-forecast/:id` - Delete hourly forecast

### Authentication
- `POST /api/auth/login` - Admin login (password: admin123)

---

## 🔐 Default Credentials

- **Admin Password**: `admin123`
- **Access Admin Panel**: Navigate to `/admin` or `/admin/login`

---

## 👤 Author

**Bishmeeta Thapa**
- GitHub: [@BishmeetaThapa](https://github.com/BishmeetaThapa)

---

<div align="center">
  <sub>Built with ❤️ for a better weather experience.</sub>
</div>
