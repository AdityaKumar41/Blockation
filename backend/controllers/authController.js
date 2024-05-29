const passport = require("passport");
const CLIENT_URL = "https://mongo.d312y57inv813w.amplifyapp.com/";
const User = require("../models/localUser");
const bcrypt = require("bcryptjs");
const ErroHandler = require("../utils/errorhander");

//If login is failure
exports.loginFailure = async (req, res, next) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

//Google Strategy starts here

exports.googleLogin = passport.authenticate("google", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
});

//Google Profile
exports.googleProfile = passport.authenticate("google", {
  scope: ["profile", "email"],
});

//Google Strategy ends here

//Local Strategy starts here
//register user
exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !confirmPassword) {
    next(new ErroHandler("Please fill all the fields below", 400));
  }
  if (password !== confirmPassword) {
    next(
      new ErroHandler("Please enter the confirm Password same as password", 400)
    );
  }
  if (password) {
    if (password.length < 8) {
      next(
        new ErroHandler(
          "The length of the password should be greater than 8",
          400
        )
      );
    }
  }

  //validation passed
  let user = await User.findOne({ email: email });
  if (user) {
    next(new ErroHandler("user already Exists please try to login", 400));
  } else {
    const newUser = await new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          next(new ErroHandler(err.message, 400));
        }
        //Set the password to the hash
        else {
          newUser.password = hash;
          //Save the user
          await newUser.save();
          res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            newUser,
          });
        }
      })
    );
  }
};
//login user
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Validate request
  if (!email || !password) {
    next(new ErroHandler("Please fill all the fields", 400));
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      next(new ErroHandler("Please provide the correct credentials", 400));
    }

    req.logIn(user, (err) => {
      if (!err)
        res.json({
          success: true,
          user: req.user,
        });
    });
  })(req, res, next);
};
//Local Strategy ends here

//logout user
exports.logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({
      message: "Logged out successfully",
    });
  }
};

//Login Success
exports.loginSuccess = async (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  } else {
    res.status(200).json({
      message: "hi",
    });
  }
};
