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
  if (sort === "salary-high") result = result.sort("-maxSalary");
  if (sort === "salary-low") result = result.sort("minSalary");
  if (sort === "latest-updated") result = result.sort("-updatedAt");

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

  const oldJob = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!oldJob) throw new NotFoundError(`No job with id : ${jobId}`);

  if (
    status === "interview" &&
    oldJob.status !== "interview" &&
    !oldJob.interviewedAt
  ) {
    req.body.interviewedAt = new Date();
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { returnDocument: "after", runValidators: true },
  );

  const acceptedJobsCount = await Job.countDocuments({
    createdBy: userId,
    status: "accepted",
  });
  if (acceptedJobsCount > 0) {
    const latestAcceptedJob = await Job.findOne({
      createdBy: userId,
      status: "accepted",
    }).sort("-updatedAt");
    if (latestAcceptedJob) {
      await User.findByIdAndUpdate(userId, {
        hiredDetails: {
          company: latestAcceptedJob.company,
          position: latestAcceptedJob.position,
          dateHired: latestAcceptedJob.updatedAt,
        },
        role: "Hired Professional",
      });
    }
  } else {
    await User.findByIdAndUpdate(userId, {
      $unset: { hiredDetails: 1 },
      role: "User", // Revert to default
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

  // Sync User Profile in case they deleted their only accepted job
  const acceptedJobsCount = await Job.countDocuments({
    createdBy: userId,
    status: "accepted",
  });
  if (acceptedJobsCount > 0) {
    const latestAcceptedJob = await Job.findOne({
      createdBy: userId,
      status: "accepted",
    }).sort("-updatedAt");
    if (latestAcceptedJob) {
      await User.findByIdAndUpdate(userId, {
        hiredDetails: {
          company: latestAcceptedJob.company,
          position: latestAcceptedJob.position,
          dateHired: latestAcceptedJob.updatedAt,
        },
        role: "Hired Professional",
      });
    }
  } else {
    // If no jobs are currently accepted
    await User.findByIdAndUpdate(userId, {
      $unset: { hiredDetails: 1 },
      role: "User",
    });
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

// SHOW STATS
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

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  let applicationsByDay = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
        appliedAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const match = applicationsByDay.find((x) => x._id === dateStr);
    activityData.push({
      name: days[d.getDay()],
      apps: match ? match.count : 0,
      date: dateStr,
    });
  }

  res.status(StatusCodes.OK).json({ defaultStats, activityData });
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  showStats,
};
