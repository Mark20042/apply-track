const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide milestone title"],
    trim: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
  },
});

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
      trim: true,
    },

    salary: {
      type: Number,
      default: 0,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "freelance"],
      required: [true, "Please provide job type"],
    },

    workSetting: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      default: "remote",
      required: [true, "Please provide work setting"],
    },
    status: {
      type: String,
      enum: [
        "interview",
        "declined",
        "pending",
        "accepted",
        "offer",
        "ghosted",
      ],
      default: "pending",
    },
    jobLink: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
        "Please provide a valid URL",
      ],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    jobLocation: {
      type: String,
      default: "Remote",
      trim: true,
    },
    jobProgress: [MilestoneSchema],

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
