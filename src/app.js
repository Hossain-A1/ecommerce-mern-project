const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const seedRouter = require("./routes/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 5,
  message: "Too many rquest from this api please try again after 1 minute",
});

app.use(cors({ credentials: true }));
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/test", (req, res) => {
  res.status(200).json({ message: "test successfull" });
});
//bypass all routes
app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/auth/", authRouter);

// client error
app.use((req, res, next) => {
  next(createError(404, { message: "Route not found!" }));
});

// server error handling --> all errors
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
