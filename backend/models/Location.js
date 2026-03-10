import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    lon: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    region: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Location', LocationSchema);
