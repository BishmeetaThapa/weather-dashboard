import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connect.js";
import weatherRouter from "./routes/weather.js";
import locationRouter from "./routes/location.js";
import forecastRouter from "./routes/forecast.js";
import hourlyForecastRouter from "./routes/hourlyForecast.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// connect database
connect();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/weather", weatherRouter);
app.use("/api/locations", locationRouter);
app.use("/api/forecast", forecastRouter);
app.use("/api/hourly-forecast", hourlyForecastRouter);
app.use("/api/auth", authRouter);


// server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});