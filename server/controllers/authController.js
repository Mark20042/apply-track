const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { UnauthenticatedError, BadRequestError } = require("../errors/index");
const generateTokens = require("../utils/generateToken");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { username, email, password, role, gender, education } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new BadRequestError("User already exists");
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    ...(role && { role }),
    ...(gender !== undefined && gender !== "" && { gender }),
    ...(education !== undefined && education !== "" && { education }),
  });

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

  // Compare candidate password with stored hash
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
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
