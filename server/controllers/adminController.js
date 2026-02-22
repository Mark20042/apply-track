const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

// GET ALL USERS (with job count per user)
const getAllUsers = async (req, res) => {
    const { search, sort } = req.query;

    const matchStage = {};

    if (search) {
        matchStage.$or = [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: "jobs",
                localField: "_id",
                foreignField: "createdBy",
                as: "jobs",
            },
        },
        {
            $project: {
                password: 0,
            },
        },
        {
            $addFields: {
                jobCount: { $size: "$jobs" },
            },
        },
        {
            // Remove the full jobs array — we only need the count here
            $project: {
                jobs: 0,
            },
        },
    ];

    // Sorting
    if (sort === "newest") {
        pipeline.push({ $sort: { createdAt: -1 } });
    } else if (sort === "oldest") {
        pipeline.push({ $sort: { createdAt: 1 } });
    } else if (sort === "most-jobs") {
        pipeline.push({ $sort: { jobCount: -1 } });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } }); // default
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await User.aggregate(countPipeline);
    const totalUsers = countResult.length > 0 ? countResult[0].total : 0;

    pipeline.push({ $skip: skip }, { $limit: limit });

    const users = await User.aggregate(pipeline);

    res.status(StatusCodes.OK).json({
        users,
        totalUsers,
        numOfPages: Math.ceil(totalUsers / limit),
        currentPage: page,
    });
};

// GET SINGLE USER + ALL THEIR JOBS
const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId}`);
    }

    const jobs = await Job.find({ createdBy: userId }).sort("-appliedAt");

    res.status(StatusCodes.OK).json({ user, jobs });
};

// PLATFORM-WIDE STATS
const getPlatformStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });

    // Job status breakdown
    let statusBreakdown = await Job.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    statusBreakdown = statusBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});

    const jobStats = {
        pending: statusBreakdown.pending || 0,
        interview: statusBreakdown.interview || 0,
        declined: statusBreakdown.declined || 0,
        accepted: statusBreakdown.accepted || 0,
        offer: statusBreakdown.offer || 0,
        ghosted: statusBreakdown.ghosted || 0,
    };

    // Job type breakdown
    let typeBreakdown = await Job.aggregate([
        { $group: { _id: "$jobType", count: { $sum: 1 } } },
    ]);

    typeBreakdown = typeBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});

    res.status(StatusCodes.OK).json({
        totalUsers,
        totalJobs,
        totalAdmins,
        jobStats,
        jobTypeBreakdown: typeBreakdown,
    });
};

// DELETE USER + ALL THEIR JOBS
const deleteUser = async (req, res) => {
    const { id: userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId}`);
    }

    if (user.isAdmin) {
        throw new NotFoundError("Cannot delete an admin user");
    }

    // Delete all jobs belonging to this user
    await Job.deleteMany({ createdBy: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(StatusCodes.OK).json({
        msg: `User "${user.username}" and all their jobs have been deleted`,
    });
};

// GET ADMIN PROFILE
const getAdminProfile = async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
        throw new NotFoundError("Admin user not found");
    }

    res.status(StatusCodes.OK).json({ user });
};

// UPDATE ADMIN PROFILE
const updateAdminProfile = async (req, res) => {
    const { username, email, gender, education, currentPassword, newPassword } =
        req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new NotFoundError("Admin user not found");
    }

    // Update basic fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (gender !== undefined) user.gender = gender;
    if (education !== undefined) user.education = education;

    // Handle password change
    if (newPassword) {
        if (!currentPassword) {
            throw new BadRequestError(
                "Please provide current password to set a new password",
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestError("Current password is incorrect");
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save({ validateModifiedOnly: true });

    // Return user without password
    const updatedUser = await User.findById(req.user.userId).select(
        "-password",
    );

    res.status(StatusCodes.OK).json({ user: updatedUser });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    getPlatformStats,
    deleteUser,
    getAdminProfile,
    updateAdminProfile,
};

