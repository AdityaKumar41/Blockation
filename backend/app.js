const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/auth");
const fileUpload = require("./routes/fileupload");
const adminRoute = require("./routes/admin");
const errorMiddleware = require("./middlewares/error");
const auth = require("./middlewares/auth");
require("dotenv").config();

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: __dirname + "/config/config.env" });
}

const PORT = process.env.PORT || 7000;

// Database connectivity
const connectDataBase = require("./config/databBase");
connectDataBase();

const app = express();

// Updated CORS configuration
app.use(
  cors({
    origin: "https://blockation.d3sulnq4v9fekq.amplifyapp.com",
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Ensure this is true to allow credentials
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication route for login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Implement user authentication (validate username and password)
  // This is a placeholder for actual user validation logic
  const user = { id: 1, username: username }; // This should come from the database

  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ success: true, message: "Logged in successfully" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

// Use the verifyToken middleware for protected routes
app.use("/auth", authRoute);
app.use("/file", fileUpload);
app.use("/admin", adminRoute);

app.get("/", verifyToken, (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({
      success: true,
      message: "User not found",
    });
  }
});

// Error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
});
