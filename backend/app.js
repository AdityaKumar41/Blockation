const cookieSession = require("cookie-session");
const IPFS = require("ipfs-http-client");
const express = require("express");
const auth = require("./middlewares/auth");
const cors = require("cors");

const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const fileUpload = require("./routes/fileupload");
const adminRoute = require("./routes/admin");
require("dotenv").config();

const errorMiddleware = require("./middlewares/error");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: __dirname + "/config/config.env" });
}

const PORT = process.env.PORT || 7000;
//Database connectivity
const connectDataBase = require("./config/databBase");

connectDataBase();

app.use(
  cors({
    origin: "https://blockation-ffth20iat-adityakumar41s-projects.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookie session for passport
app.use(
  cookieSession({
    name: "session",
    keys: ["profile", "email"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/file", fileUpload);
app.use("/admin", adminRoute);
app.get("/", (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({
      success: true,
      message: "User not got",
    });
  }
});

//error Middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
});
