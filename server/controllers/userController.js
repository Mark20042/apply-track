const User = require("../models/User");
const Job = require("../models/Job");
const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  res.status(StatusCodes.OK).json({ user });
};

/** For optional auth: returns { user } or { user: null } with 200. No 401. */
const getCurrentUserOrNull = async (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.OK).json({ user: null });
  }
  const user = await User.findById(req.user.userId).select("-password");
  res.status(StatusCodes.OK).json({ user: user || null });
};

const updateUserProfile = async (req, res) => {
  const { gender, education, role } = req.body;

  // Do not allow users to force a "Hired Professional" role if they aren't actually hired.
  let finalRole = role;
  if (role === "Hired Professional") {
    const dbUser = await User.findById(req.user.userId);
    if (!dbUser.hiredDetails || !dbUser.hiredDetails.company) {
      finalRole = "Job Hunter";
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { gender, education, role: finalRole },
    { returnDocument: "after", runValidators: true },
  ).select("-password");

  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  // Cascading Delete: Erase all jobs linked to this User
  await Job.deleteMany({ createdBy: req.user.userId });
  const user = await User.findByIdAndDelete(req.user.userId);
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getCurrentUser,
  getCurrentUserOrNull,
  updateUserProfile,
  deleteUser,
};
