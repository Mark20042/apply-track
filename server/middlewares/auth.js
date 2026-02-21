const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const authenticationMiddleware = async (req, res, next) => {
  //  Look for the token inside the cookies
  const token = req.cookies.accessToken;

  //  If it's not there, reject the request
  if (!token) {
    throw new UnauthenticatedError("No token provided");
  }

  try {
    // Verify the token using your specific access secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    //  Attach the decoded payload to req.user
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;
