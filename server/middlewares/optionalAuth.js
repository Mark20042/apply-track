const jwt = require("jsonwebtoken");

/**
 * Like auth middleware but never throws.
 * If no token or invalid token: sets req.user = null.
 * If valid token: sets req.user = decoded payload.
 * Use for "current user or null" endpoints (e.g. GET /user/me) so the client
 * always gets 200 and avoids 401 when not logged in.
 */
const optionalAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
};

module.exports = optionalAuth;
