const passport = require("passport");
const CLIENT_URL = "https://blockation.d3sulnq4v9fekq.amplifyapp.com";
const User = require("../models/localUser");
const bcrypt = require("bcryptjs");
const ErroHandler = require("../utils/errorhander");

// If login is failure
exports.loginFailure = async (req, res, next) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

// Google Strategy starts here
exports.googleLogin = passport.authenticate("google", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
});

// Google Profile
exports.googleProfile = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Local Strategy starts here
// Register user
exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErroHandler("Please fill all the fields below", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErroHandler("Please enter the confirm Password same as password", 400)
    );
  }
  if (password.length < 8) {
    return next(
      new ErroHandler(
        "The length of the password should be greater than 8",
        400
      )
    );
  }

  // Validation passed
  let user = await User.findOne({ email });
  if (user) {
    return next(
      new ErroHandler("User already exists, please try to login", 400)
    );
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          return next(new ErroHandler(err.message, 400));
        }
        // Set the password to the hash
        newUser.password = hash;
        // Save the user
        await newUser.save();
        res.status(200).json({
          success: true,
          message: "User Registered Successfully",
          user: newUser,
        });
      })
    );
  }
};

// Login user
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Validate request
  if (!email || !password) {
    return next(new ErroHandler("Please fill all the fields", 400));
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(new ErroHandler(err.message, 500));
    }
    if (!user) {
      return next(new ErroHandler("Invalid credentials", 400));
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(new ErroHandler(err.message, 500));
      }
      res.json({
        success: true,
        user: req.user,
      });
    });
  })(req, res, next);
};

// Logout user
exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(new ErroHandler(err.message, 500));
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

// Login Success
exports.loginSuccess = (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successful",
      user: req.user,
    });
  } else {
    res.status(200).json({
      message: "Not authenticated",
    });
  }
};
