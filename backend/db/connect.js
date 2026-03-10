
import mongoose from "mongoose";

async function connect() {
  const res = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weather_app');
  if (res.connections) {
    console.log('✅ MongoDB Connected successfully!');
  }
}

export default connect;