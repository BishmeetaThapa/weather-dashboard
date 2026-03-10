import dotenv from "dotenv";
dotenv.config();

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const adminToken = "admin-session-token-skycast"; // This matches what auth controller returns

    if (authHeader && authHeader === `Bearer ${adminToken}`) {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: "Access Denied: Administrative privileges required." 
        });
    }
};

export default adminAuth;
