import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // ✅ Debugging: Log incoming cookies
        console.log("Cookies received:", req.cookies);

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. No token provided.",
                success: false,
            });
        }

        // ✅ Verify JWT Token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated;
