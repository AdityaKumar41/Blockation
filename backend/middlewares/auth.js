const ErrorHandler = require("../utils/errorhander");

function auth(req, res, next) {
  // Check if the authentication cookie is present
  if (req.cookies && req.cookies.userId) {
    // Authentication logic here (e.g., check if the cookie is valid)
    // For example, you might decode the cookie and verify it against your database
    // If authentication is successful, you can proceed to the next middleware
    return next();
  } else {
    // If the authentication cookie is not present or invalid, return an error
    return next(
      new ErrorHandler("Unauthorized: Please login to access the content", 401)
    );
  }
}

module.exports = auth;
