const jwt = require("jsonwebtoken");

const generateTokens = (user, res) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
  );

  // Safely parse the days from env, defaulting to 1 day if something is wrong
  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 1;
  const cookieMaxAge = days * 24 * 60 * 60 * 1000;

  // Set Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: cookieMaxAge,
  });
};

module.exports = generateTokens;
