const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide task title"],
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  }
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

    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    minSalary: {
      type: Number,
      default: 0,
    },
    maxSalary: {
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
    interviewedAt: {
      type: Date,
    },
    jobLocation: {
      type: String,
      default: "Remote",
      trim: true,
    },
    tasks: [TaskSchema],

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
