const User = require("../models/User");
const { UnauthenticatedError, BadRequestError } = require("../errors/index");
const generateTokens = require("../utils/generateToken");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new BadRequestError("User already exists");
  }

  const user = await User.create({ username, email, password, role });

  generateTokens(user, res);

  res.status(StatusCodes.CREATED).json({
    user: { username: user.username, role: user.role },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (password !== user.password) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  generateTokens(user, res);

  res.status(StatusCodes.OK).json({
    user: { username: user.username, role: user.role },
  });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
