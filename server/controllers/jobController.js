const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/index");

// GET ALL JOBS (With Search & Filter)
const getAllJobs = async (req, res) => {
  const { status, jobType, workSetting, sort, search } = req.query;

  const queryObject = { createdBy: req.user.userId };

  if (status && status !== "all") queryObject.status = status;
  if (jobType && jobType !== "all") queryObject.jobType = jobType;
  if (workSetting && workSetting !== "all")
    queryObject.workSetting = workSetting;
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  let result = Job.find(queryObject);

  // --- Sorting ---
  if (sort === "latest") result = result.sort("-appliedAt");
  if (sort === "oldest") result = result.sort("appliedAt");
  if (sort === "salary-high") result = result.sort("-salary");
  if (sort === "salary-low") result = result.sort("salary");

  // --- Pagination ---
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages,
    currentPage: page,
  });
};

// CREATE JOB
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// UPDATE JOB
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true },
  );

  if (!job) throw new NotFoundError(`No job with id : ${jobId}`);

  // Automatically update User Profile if hired
  if (status === "accepted") {
    await User.findByIdAndUpdate(userId, {
      hiredDetails: {
        company: job.company,
        position: job.position,
        dateHired: new Date(),
      },
      role: "Hired Professional",
    });
  }

  res.status(StatusCodes.OK).json({ job });
};

// DELETE JOB
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const userId = req.user.userId;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) throw new NotFoundError(`No job with id : ${jobId}`);
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

// SHOW STATS (For your Dashboard)
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
    accepted: stats.accepted || 0,
    offer: stats.offer || 0,
    ghosted: stats.ghosted || 0,
  };

  res.status(StatusCodes.OK).json({ defaultStats });
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  showStats,
};
