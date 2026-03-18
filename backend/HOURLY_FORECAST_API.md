# Hourly Forecast API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/hourly-forecast` | Get all hourly forecasts | Public |
| GET | `/hourly-forecast/city?city=Kathmandu` | Get hourly forecasts by city | Public |
| GET | `/hourly-forecast/city/Kathmandu?date=2024-01-15` | Get hourly by city and date | Public |
| GET | `/hourly-forecast/24h?city=Kathmandu` | Get next 24 hours | Public |
| GET | `/hourly-forecast/:id` | Get by ID | Public |
| POST | `/hourly-forecast` | Create single | Admin |
| POST | `/hourly-forecast/bulk` | Create bulk | Admin |
| PUT | `/hourly-forecast/:id` | Update by ID | Admin |
| DELETE | `/hourly-forecast/:id` | Delete by ID | Admin |

---

## Sample JSON Bodies for ThunderClient

### POST /api/hourly-forecast (Single Entry)

```json
{
  "city": "Kathmandu",
  "date": "2024-01-15T00:00:00.000Z",
  "hour": 0,
  "temperature": 12,
  "feels_like": 10,
  "condition": "Clear",
  "description": "Clear sky",
  "icon": "sun",
  "humidity": 65,
  "wind_speed": 5,
  "clouds": 10,
  "precipitation": 0
}
```

### POST /api/hourly-forecast/bulk (Kathmandu - 8 hours)

```json
{
  "forecasts": [
    {
      "city": "Kathmandu",
      "date": "2024-01-15T00:00:00.000Z",
      "hour": 0,
      "temperature": 12,
      "feels_like": 10,
      "condition": "Clear",
      "description": "Clear sky",
