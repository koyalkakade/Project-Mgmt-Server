const mongoose = require('mongoose')

const user = new mongoose.Schema(  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "HOD"],
      default: "user",
    },

    imgPath: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", user)
module.exports =User