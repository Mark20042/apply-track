require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Security Packages
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const authRouter = require("./routes/authRoutes");
const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

// MIDDLEWARE

// Set security HTTP headers
app.use(helmet());

//  Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);

// Rate limiting (Prevents brute-force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, //  100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// rate limiter only applies to /api routes
app.use("/api", apiLimiter);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}
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
