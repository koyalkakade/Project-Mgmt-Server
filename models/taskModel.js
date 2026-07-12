const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Inprogress", "Completed"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    docPath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("task", taskSchema);
module.exports=Task;
