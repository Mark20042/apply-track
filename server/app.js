require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet"); // security
const app = express();

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const authRouter = require("./routes/authRoutes");
const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/userRoutes");

// middleware
app.use(helmet());
app.use(express.static("./public"));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);
app.use("/api/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
};

start();
