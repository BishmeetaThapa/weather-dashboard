<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/cloud-sun.svg" width="80" height="80" alt="SkyCast Logo" />
  <h1> Real-Time Weather Dashboard</h1>
  <p>A modern, high-performance SaaS weather dashboard focused on the Nepal region, built with Next.js 15 and real-time API integration.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind-v4-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </div>
</div>

---

## 🚀 Overview

**Weather dashboard** is a production-ready weather forecasting application designed for professional monitoring and personal use. It focuses on delivering accurate, real-time weather metrics for **Kathmandu and major cities in Nepal**, integrated with a functional backend for personalized location tracking.

### 🌟 Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <b>📡 Real-Time Monitoring</b><br/>
      Live weather polling every 5 minutes using the Open-Meteo API.
    </td>
    <td width="50%">
      <b>📊 Analytical Charts</b><br/>
      Interactive temperature trend charts powered by Chart.js.
    </td>
  </tr>
  <tr>
    <td>
      <b>🇳🇵 Nepal Regional Focus</b><br/>
      Pre-configured tracking for Kathmandu, Pokhara, and other major hubs.
    </td>
    <td>
      <b>🛠️ Location CRUD</b><br/>
      Full management of saved locations with persistent backend integration.
    </td>
  </tr>
  <tr>
    <td>
      <b>📅 7-Day Forecast</b><br/>
      Detailed weekly breakdown with modern icons and precision metrics.
    </td>
    
  </tr>
</table>

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Data**: [Axios](https://axios-http.com/) & React Hooks
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals**: [Chart.js](https://www.chartjs.org/) & [React-Chartjs-2](https://react-chartjs-2.js.org/)
- **API**: [Open-Meteo](https://open-meteo.com/) (Free Weather API)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BishmeetaThapa/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
src/
├── app/             # Next.js App Router (Pages & Layouts)
├── components/      # Reusable UI & Weather Widgets
├── features/        # Feature-specific logic (Auth/Location)
├── lib/             # API Clients & Utility functions
└── styles/          # Global styles & Tailwind config
```

---

## 👤 Author

**Bishmeeta Thapa**
- GitHub: [@BishmeetaThapa](https://github.com/BishmeetaThapa)

---

<div align="center">
  <sub>Built with ❤️ for a better weather experience.</sub>
</div>
