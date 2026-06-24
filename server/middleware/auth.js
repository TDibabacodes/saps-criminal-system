const jwt = require("jsonwebtoken");

// This function runs on every protected route
// It checks if the request has a valid JWT token
module.exports = function (req, res, next) {
  // Get token from the request header
  const token = req.header("Authorization")?.split(" ")[1];

  // If no token found, block the request
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();             // allow the request to continue
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};