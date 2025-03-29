import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // ✅ Debugging: Log incoming cookies and headers (Remove in production)
        console.log("Cookies received:", req.cookies);
        console.log("Authorization Header:", req.headers.authorization);

        // Extract token from cookies or Authorization header
        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. No token provided.",
            });
        }

        // ✅ Verify JWT Token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Attach user ID to request object
        req.id = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(401).json({
            success: false,
            message: error.name === "JsonWebTokenError" ? "Invalid token" :
                     error.name === "TokenExpiredError" ? "Token expired, please log in again" :
                     "Authentication failed",
        });
    }
};

export default isAuthenticated;
