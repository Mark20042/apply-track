const User = require("../models/User");
const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  res.status(StatusCodes.OK).json({ user });
};

const updateUserProfile = async (req, res) => {
  const { gender, education } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { gender, education },
    { returnDocument: "after", runValidators: true },
  ).select("-password");

  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.userId);
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  deleteUser,
};
