const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    role: {
      type: String,
      default: "Job Hunter",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say", "Other", ""],
      default: "",
    },
    education: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hiredDetails: {
      company: { type: String, trim: true, default: "" },
      position: { type: String, trim: true, default: "" },
      dateHired: { type: Date },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
