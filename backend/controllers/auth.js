export const login = async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
        // In a real app, we'd use JWT. For this simple case, we'll return a success token.
        res.status(200).json({ success: true, token: "admin-session-token-skycast" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Security Credentials" });
    }
};
