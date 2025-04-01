import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Log incoming cookies and headers (remove in production)
        console.log("Cookies received:", req.cookies);
        console.log("Authorization Header:", req.headers.authorization);

        // Extract token from cookies or Authorization header
        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. User is not authenticated."
            });
        }

        // Decode the token to extract user info (optional check)
        const decoded = jwt.decode(token); // Decode to get user ID and other details
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again."
            });
        }

        // Verify JWT Token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: err.name === "TokenExpiredError" 
                        ? "Token expired. Please log in again."
                        : "Invalid token. Please log in again."
                });
            }

            // Attach user ID to the request object
            req.id = decoded.userId;
            next();
        });

    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication."
        });
    }
};

export default isAuthenticated;
