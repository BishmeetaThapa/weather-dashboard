# ☁️ Real-Time Weather Dashboard

A production-ready weather forecasting application designed for professional monitoring and personal use. Built with **Next.js 15, Node.js/Express, and MongoDB**, it delivers accurate, real-time weather metrics for Kathmandu and major cities in Nepal.

---

## 🌟 Key Features

### Weather Monitoring
- **Real-Time Dashboard** - Live weather updates with auto-refresh every 5 minutes
- **7-Day Forecast** - Comprehensive weekly weather predictions
- **Hourly Forecasts** - 24-48 hour detailed hourly breakdowns
- **Current Weather** - Temperature, humidity, wind speed, pressure, and more
- **Temperature Statistics** - Interactive charts and analytics
- **Location Management** - Save, edit, and manage multiple locations

### Admin & Management
- **Admin Dashboard** - Full control over weather data management
- **CRUD Operations** - Create, read, update, delete for all data types
- **Hourly Data Management** - Manage hourly forecast entries via UI
- **Location CRUD** - Add/edit/delete tracked locations

### Technical Highlights
- **GPS Location Detection** - Automatic weather based on your position
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Glassmorphism UI** - Modern, beautiful interface with animations
- **MongoDB Persistence** - All data stored persistently

---

## 📂 Project Structure

```
weather-dashboard/
├── weather-frontend/           # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   │   ├── admin/          # Admin panel & login
│   │   │   ├── dashboard/      # Main weather dashboard
│   │   │   ├── forecast/       # 7-day forecast page
│   │   │   ├── current-weather/ # Current conditions
│   │   │   ├── locations/     # Location management
│   │   │   ├── temperature-stats/ # Analytics & charts
│   │   │   └── settings/       # App settings
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── ui/             # UI primitives
│   │   │   └── weather/        # Weather widgets
│   │   └── lib/                # API clients & utilities
│   └── package.json
│
├── backend/                    # Node.js/Express Backend
│   ├── controllers/            # Route handlers
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── middleware/             # Custom middleware
│   ├── db/                     # Database configuration
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend Technologies
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| React 18 | UI library with hooks |
| Tailwind CSS v4 | Utility-first styling |
| TypeScript | Type safety |
| Framer Motion | Smooth animations |
| Chart.js | Data visualization |
| Lucide React | Icon library |
| Axios | HTTP client |

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| Open-Meteo API | Weather data source |

---

## ⚙️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BishmeetaThapa/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/weather-dashboard
   ADMIN_PASSWORD=admin123
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```

5. **Install Frontend Dependencies**
   ```bash
   cd weather-frontend
   npm install
   ```

6. **Configure Frontend Environment**
   Create a `.env.local` file in weather-frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

7. **Start Frontend Server**
   ```bash
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

---

## 📡 API Endpoints Reference

### Weather Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather` | Fetch all weather records |
| GET | `/api/weather?lat=X&lon=Y` | Weather by coordinates |
| POST | `/api/weather` | Create new weather entry |
| PUT | `/api/weather/:id` | Update weather record |
| DELETE | `/api/weather/:id` | Delete weather record |

### Location Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all saved locations |
| POST | `/api/locations` | Add new location |
| PUT | `/api/locations/:id` | Update location details |
| DELETE | `/api/locations/:id` | Remove location |

### Forecast Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forecast` | Get all forecasts |
| GET | `/api/forecast/:city` | Get forecast by city name |
| POST | `/api/forecast` | Create forecast entry |
| PUT | `/api/forecast/:id` | Update forecast |
| DELETE | `/api/forecast/:id` | Delete forecast |

### Hourly Forecasts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hourly-forecast` | Get all hourly forecasts |
| GET | `/api/hourly-forecast/city?city=NAME` | Get hourly for specific city |
| POST | `/api/hourly-forecast` | Create hourly entry |
| PUT | `/api/hourly-forecast/:id` | Update hourly forecast |
| DELETE | `/api/hourly-forecast/:id` | Delete hourly forecast |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login endpoint |

---

## 🔐 Access Credentials

- **Admin Password**: `admin123`
- **Admin Panel URL**: `/admin`
- **Login URL**: `/admin/login`

---

## 🧭 Application Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Main weather dashboard with GPS detection & auto-refresh |
| `/forecast` | 7-day weather forecast with hourly breakdown |
| `/current-weather` | Detailed current weather conditions |
| `/locations` | Manage saved weather locations |
| `/temperature-stats` | Temperature analytics with charts |
| `/settings` | Application settings and preferences |
| `/admin` | Full admin panel for data management |
| `/admin/login` | Secure admin authentication |

---

## 🤝 Support & Contributing

Feel free to fork this repository and submit pull requests for new features or bug fixes.

---

## 📜 License

This project is distributed under the MIT License.

---

## 👤 Project Author

**Bishmeeta Thapa**
- GitHub: [@BishmeetaThapa](https://github.com/BishmeetaThapa)

---

<div align="center">
  Built with ❤️ for weather enthusiasts
</div>
