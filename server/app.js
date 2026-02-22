require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

// Security Packages
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();
const connectDB = require("./db/connect");
const { swaggerUi, swaggerSpec } = require("./swagger");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const authRouter = require("./routes/authRoutes");
const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

// MIDDLEWARE

// Set security HTTP headers (disable CSP for Swagger UI)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "https://unpkg.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

//  Enable CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];
// Add production frontend URL from env (set CLIENT_URL on Render)
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Rate limiting (Prevents brute-force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, //  100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Swagger API Docs (mounted before rate limiter so docs are always accessible)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "ApplyTrack API Docs",
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    tagsSorter: 'alpha',
  },
}));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// rate limiter only applies to /api routes
app.use("/api", apiLimiter);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));

app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: req.query,
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

//  Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
