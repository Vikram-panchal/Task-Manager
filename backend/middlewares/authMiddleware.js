const jwt = require("jsonwebtoken");
const User = require("../models/models.User");

//Middleware to protect private routes
const Protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if(token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; //extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        else{
            res.status(401).json({ message: "Not authorized" });
        }
    } catch (error) {
        console.log(error);
    }
};

// Middleware for admin routes
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ message: "Access denied, admin only" });
    }
}
module.exports = { Protect, adminOnly };