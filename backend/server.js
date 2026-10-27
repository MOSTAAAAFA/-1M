const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// 🔒 Validate JWT_SECRET before starting server
const { validateOrExit } = require("./utils/validateJwtSecret");
validateOrExit();

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");
const wishlistRoutes = require("./routes/wishlist");
const loyaltyRoutes = require("./routes/loyalty");
const activityRoutes = require("./routes/activities");
const adminRoutes = require("./routes/admin");
const settingsRoutes = require("./routes/settings");
const ttsRoutes = require("./routes/tts");
const voiceRoutes = require("./routes/voice");

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { chatWithTools } = require("./services/chatService");
const { limiter, helmet, mongoSanitize, hpp } = require("./middleware/security");
const logger = require("./utils/logger");

const app = express();
app.set("trust proxy", 1);

// 🔒 Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["https://js.stripe.com"]
    }
  }
}));

// 🟢 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration - restrict in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Express 5 exposes req.query as a getter-only property, so the stock
// express-mongo-sanitize middleware (`req.query = ...`) throws a TypeError
// on every request. Apply the same sanitizer against the writable parts of
// the request, and re-define req.query in place to preserve protection.
const sanitizeRequest = (req, res, next) => {
  try {
    const { sanitize } = mongoSanitize;
    ["body", "params", "headers"].forEach((key) => {
      if (req[key] && typeof req[key] === "object") {
        req[key] = sanitize(req[key]);
      }
    });
    if (req.query && typeof req.query === "object") {
      Object.defineProperty(req, "query", {
        value: sanitize({ ...req.query }),
        configurable: true,
        writable: true,
      });
    }
  } catch (err) {
    console.error("Request sanitization error:", err.message);
  }
  next();
};

// Sanitize data
app.use(sanitizeRequest);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting
app.use("/api/", limiter);

// HTTP request logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// 🟢 Serve static HTML file
app.use(express.static(__dirname));

// 🟢 API Routes - v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/loyalty", loyaltyRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", ttsRoutes);
app.use("/api/v1", voiceRoutes);

// Keep backward compatibility
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// 🤖 AI Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, system } = req.body;
    const result = await chatWithTools({
      messages: messages || [],
      system: system || "You are a helpful assistant.",
    });
    res.json({ content: [{ text: result.text }], actions: result.actions || [] });
  } catch (err) {
    console.error("Chat error:", err.status, err.message);
    res.status(500).json({
      error: { message: err.message || "Chat request failed" }
    });
  }
});

// 🟢 Health check
app.get("/", (req, res) => {
  res.json({ status: "API WORKING 🚀", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// 🟢 MongoDB with options
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log("MongoDB Connected ✅");
    logger.info("MongoDB Connected successfully");
  })
  .catch(err => {
    console.error("MongoDB Error ❌:", err.message);
    logger.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

// 🟢 PORT (IMPORTANT for Railway)
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
  logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
