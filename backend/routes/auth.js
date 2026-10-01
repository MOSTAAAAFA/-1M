const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/security");

const router = express.Router();

// 🔒 Validate JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

// Test route
router.get("/test", (req, res) => {
    res.json({ ok: true });
});

// Register (NOW SAVING TO DB)
router.post("/register", authLimiter, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Email length validation
        if (email.length > 254) {
            return res.status(400).json({ message: "Email is too long" });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        if (password.length > 128) {
            return res.status(400).json({ message: "Password is too long (max 128 characters)" });
        }

        // Check password complexity: at least one uppercase, one lowercase, one number
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            });
        }

        // Name validation
        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
        }

        // Phone validation (if provided)
        if (phone && phone.length > 20) {
            return res.status(400).json({ message: "Phone number is too long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || ''
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set httpOnly cookie for secure token storage
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user without password
        const { password: _, ...safeUser } = user._doc;

        res.status(201).json({
            message: "User registered successfully",
            user: safeUser
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

// Login (NOW CHECKING DB)
router.post("/login", authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set httpOnly cookie for secure token storage
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user without password and add role field
        const { password: _, ...safeUser } = user._doc;

        res.json({
            message: "Login successful",
            user: {
                ...safeUser,
                role: user.isAdmin ? 'admin' : 'user'
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
});

// 🔐 PROFILE (PROTECTED ROUTE)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json({
            message: "Profile data",
            user
        });

    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ message: "Failed to retrieve profile. Please try again." });
    }
});

// Logout - Clear httpOnly cookie
router.post("/logout", (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: "Logged out successfully" });
});

module.exports = router;