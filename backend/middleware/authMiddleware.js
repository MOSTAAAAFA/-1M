const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // Read token from httpOnly cookie instead of Authorization header
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};