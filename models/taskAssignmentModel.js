const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    assignBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ["Assigned", "Accepted", "Rejected", "Completed"],
        default: "Assigned",
    }
},
    {
        timestamps: true,
    }

)



taskAssignmentSchema.index(
    { task_id: 1, user_id: 1 },
    { unique: true }
);

const TaskAssignment = mongoose.model(
    "TaskAssignment",
    taskAssignmentSchema
);

module.exports = TaskAssignment;