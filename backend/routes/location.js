import { Router } from "express";
import Location from "../models/Location.js";
import adminAuth from "../middleware/auth.js";

const locationRouter = Router();

// GET all locations
locationRouter.get("/", async (req, res) => {
    try {
        const locations = await Location.find().sort({ createdAt: -1 });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET location by ID
locationRouter.get("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// CREATE location
locationRouter.post("/", adminAuth, async (req, res) => {
    try {
        const newLocation = await Location.create(req.body);
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE location
locationRouter.put("/:id", adminAuth, async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(updatedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE location
locationRouter.delete("/:id", adminAuth, async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndDelete(req.params.id);

        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default locationRouter;
