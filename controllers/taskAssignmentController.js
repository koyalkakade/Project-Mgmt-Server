const TaskAssignment = require('../models/taskAssignmentModel')
const Task = require('../models/taskModel')
const User = require('../models/userModel')
const Project = require('../models/projectModel')


async function assignTask(req, res) {

    try {
        const { task_id, user_id } = req.body
        //console.log(req.body)
        // Check Task
        const existingTask = await Task.findById(task_id);

        if (!existingTask) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        // Check User
        const existingUser = await User.findById(user_id);
        //console.log(existingUser)

        if (!existingUser) {
            return res.status(404).send({
                success: false,
                msg: "User not found"
            });
        }

        // Prevent duplicate assignment
        const alreadyAssigned = await TaskAssignment.findOne({
            task_id,
            user_id
        });

        if (alreadyAssigned) {
            return res.status(400).send({
                success: false,
                msg: "Task is already assigned to this user."
            });
        }


        const newAssignment = await TaskAssignment.create({
            task_id: task_id,
            user_id: user_id,
            assignBy: req.user.id
        })
        await newAssignment.save()

        res.status(200).send({ success: true, msg: "Task Assigned Successfully" })


    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

const assignMultipleUsers = async (req, res) => {
    try {
        const { task_id, user_ids } = req.body;
console.log(req.body)
        if (!task_id || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Task ID and user_ids are required."
            });
        }

        // Check Task
        const existingTask = await Task.findById(task_id);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                msg: "Task not found."
            });
        }

        const assignedUsers = [];
        const skippedUsers = [];

        for (const userId of user_ids) {

            // Check User
            const existingUser = await User.findById(userId);

            if (!existingUser) {
                skippedUsers.push({
                    userId,
                    reason: "User not found"
                });
                continue;
            }

            // Check Duplicate
            const alreadyAssigned = await TaskAssignment.findOne({
                task_id,
                user_id: userId
            });

            if (alreadyAssigned) {
                skippedUsers.push({
                    userId,
                    reason: "Already assigned"
                });
                continue;
            }

            const assignment = new TaskAssignment({
                task_id,
                user_id: userId,
                assignBy: req.user.id
            });

            await assignment.save();

            assignedUsers.push(userId);
        }

        res.status(200).json({
            success: true,
            msg: "Task assignment completed.",
            assignedUsers,
            skippedUsers
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const assignMultipleTasks = async (req, res) => {
    try {
        const { user_id, task_ids } = req.body;

        if (!user_id || !Array.isArray(task_ids) || task_ids.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "user_id and task_ids are required."
            });
        }

        // Check User
        const existingUser = await User.findById(user_id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "User not found."
            });
        }

        const assignedTasks = [];
        const skippedTasks = [];

        for (const taskId of task_ids) {

            // Check Task
            const existingTask = await Task.findById(taskId);

            if (!existingTask) {
                skippedTasks.push({
                    taskId,
                    reason: "Task not found"
                });
                continue;
            }

            // Prevent duplicate assignment
            const alreadyAssigned = await TaskAssignment.findOne({
                task_id: taskId,
                user_id
            });

            if (alreadyAssigned) {
                skippedTasks.push({
                    taskId,
                    reason: "Already assigned"
                });
                continue;
            }

            const assignment = new TaskAssignment({
                task_id: taskId,
                user_id,
                assignBy: req.user.id
            });

            await assignment.save();

            assignedTasks.push(taskId);
        }

        return res.status(200).json({
            success: true,
            msg: "Tasks assigned successfully.",
            assignedTasks,
            skippedTasks
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

async function getAllAssignments(req, res) {
    try {

        const assignments = await TaskAssignment.find()
            .populate({
                path: "task_id",
                select: "title description status startDate endDate"
            })
            .populate({
                path: "user_id",
                select: "name email contactNumber role imgPath"
            })
            .populate({
                path: "assignBy",
                select: "name email role"
            })
            .sort({ createdAt: -1 });

        const result = assignments.map((item) => {

            const assignment = item.toObject();

            if (assignment.user_ID && assignment.user_ID.imgPath) {
                assignment.user_ID.imgPath =
                    `http://localhost:7005/uploads/${assignment.user_ID.imgPath}`;
            }

            return assignment;
        });

        res.status(200).send({
            success: true,
            totalAssignments: result.length,
            assignments: result
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

const getUsersByTask = async (req, res) => {
    try {
        const { task_id } = req.params;

        const assignments = await TaskAssignment.find({ task_id })
            .populate({
                path: "task_id",
                select: "title description startDate endDate status project_ID docPath"
            })
            .populate({
                path: "user_id",
                select: "name email mobile profileImage"
            })
            .populate({
                path: "assignBy",
                select: "name email"
            });

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No users assigned to this task."
            });
        }

        res.status(200).json({
            success: true,
            totalUsers: assignments.length,
            data: assignments
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const getTasksByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
// console.log(user_id)
        const assignments = await TaskAssignment.find({ user_id })
            .populate({
                path: "task_id",
                select: "title description startDate endDate status project_ID docPath",
                populate: {
                    path: "project_ID",
                    select: "title description department status"
                }
            })
            .populate({
                path: "user_id",
                select: "name email mobile profileImage"
            })
            .populate({
                path: "assignBy",
                select: "name email"
            });

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No tasks assigned to this user."
            });
        }

        res.status(200).json({
            success: true,
            totalTasks: assignments.length,
            data: assignments
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const getMyAssignedTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const assignments = await TaskAssignment.find({ user_id: userId })
            .populate({
                path: "task_id",
                select: "title description startDate endDate status docPath project_ID",
                populate: {
                    path: "project_ID",
                    select: "title description department status startDate endDate"
                }
            })
            .populate({
                path: "assignBy",
                select: "name email"
            });

        res.status(200).json({
            success: true,
            totalTasks: assignments.length,
            getTasks: assignments
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};


const changeAssignedUser = async (req, res) => {
    try {
        const { ID } = req.params;
        const { user_id } = req.body;

        if (!ID || !user_id) {
            return res.status(400).json({
                success: false,
                msg: "ID and user_id are required."
            });
        }

        // Check New User
        const newUser = await User.findById(user_id);

        if (!newUser) {
            return res.status(404).json({
                success: false,
                msg: "New user not found."
            });
        }

        // Check if already assigned to new user
        const alreadyAssigned = await TaskAssignment.findOne({
            _id: ID,
            user_id: user_id
        });

        if (alreadyAssigned) {
            return res.status(400).json({
                success: false,
                msg: "Task is already assigned to the new user."
            });
        }

        const assignment = await TaskAssignment.findById(ID);

        if (!assignment) {
            return res.status(404).send({
                success: false,
                msg: "Assignment not found"
            });
        }
        // console.log('assignment', assignment)
        // Update assignment
        assignment.user_id = user_id;
        assignment.assignBy = req.user.id;
        assignment.status = "Assigned";

        await assignment.save();

        const updatedAssignment = await TaskAssignment.findById(assignment._id)
            .populate("user_id", "name email")
            .populate("assignBy", "name email");

        res.status(200).json({
            success: true,
            msg: "Task reassigned successfully.",
            data: updatedAssignment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};


async function updateAssignmentStatus(req, res) {
    try {
        const ID = req.params.ID;
        const { status } = req.body;

        const allowedStatus = ["Assigned", "Accepted", "Rejected", "Completed"];

        if (!status || !allowedStatus.includes(status)) {
            return res.status(400).send({
                success: false,
                msg: "Invalid status"
            });
        }

        const assignment = await TaskAssignment.findById(ID);

        if (!assignment) {
            return res.status(404).send({
                success: false,
                msg: "Assignment not found"
            });
        }

        const updatedAssignment = await TaskAssignment.findByIdAndUpdate(
            ID,
            { status },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("task_id", "title description status")
            .populate("user_id", "name email role")
            .populate("assignBy", "name email role");

        res.status(200).send({
            success: true,
            msg: "Assignment status updated successfully",
            assignment: updatedAssignment
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

const removeUserFromTask = async (req, res) => {
    try {
        const { ID } = req.body;

        if (!ID) {
            return res.status(400).json({
                success: false,
                msg: "assignment_id is required."
            });
        }

        // Check Assignment
        const assignment = await TaskAssignment.findById(ID);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                msg: "Task assignment not found."
            });
        }

        await TaskAssignment.findByIdAndDelete(ID);

        return res.status(200).json({
            success: true,
            msg: "User removed from task successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const removeAllUsersFromTask = async (req, res) => {
    try {
        const { TASK_ID } = req.params;

        if (!TASK_ID) {
            return res.status(400).json({
                success: false,
                msg: "TASK_ID is required."
            });
        }

        // Check Assignment
        const assignments = await TaskAssignment.find({ task_id: TASK_ID })
        if (!assignment) {
            return res.status(404).json({
                success: false,
                msg: "Task assignment not found."
            });
        }

        const filter = { task_id: TASK_ID };
        await TaskAssignment.deleteMany(filter);

        return res.status(200).json({
            success: true,
            msg: "All User removed from task successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const removeTaskFromUser = async (req, res) => {
    try {
        const { USER_ID, TASK_ID } = req.params;

        if (!TASK_ID || !USER_ID) {
            return res.status(400).json({
                success: false,
                msg: "TASK_ID and USER_ID is required."
            });
        }

        // Check Assignment
        const assignments = await TaskAssignment.find({ task_id: TASK_ID })
        if (!assignment) {
            return res.status(404).json({
                success: false,
                msg: "Task assignment not found."
            });
        }

        await TaskAssignment.deleteMany({
            task_id: TASK_ID,
            user_id: USER_ID
        });

        return res.status(200).json({
            success: true,
            msg: "All User removed from task successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "Server Error"
        });
    }
};

const getUnassignedTasks = async (req, res) => {
    try {
        // Get all assigned task IDs
        const assignedTaskIds = await TaskAssignment.distinct("task_id");
        //console.log(assignedTaskIds)
        // Find tasks that are not assigned to anyone
        const tasks = await Task.find({
            _id: { $nin: assignedTaskIds }
        })
            .populate("project_ID", "title")
            .populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching unassigned tasks",
            error: error.message
        });
    }
};

const getUsersWithoutTasks = async (req, res) => {
    try {
        // Get all users who have at least one task assigned
        const assignedUserIds = await TaskAssignment.distinct("user_id");

        // Find users without any assigned tasks
        const users = await User.find({
            _id: { $nin: assignedUserIds }
        }).select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching users without tasks",
            error: error.message
        });
    }
};

const getAssignmentsByStatus = async (req, res) => {
    try {
        const result = await TaskAssignment.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            }
        ]);

        // Default counts
        const statusCounts = {
            Assigned: 0,
            Accepted: 0,
            Rejected: 0,
            Completed: 0
        };

        // Update counts from aggregation result
        result.forEach(item => {
            statusCounts[item._id] = item.total;
        });

        return res.status(200).json({
            success: true,
            totalAssignments:
                statusCounts.Assigned +
                statusCounts.Accepted +
                statusCounts.Rejected +
                statusCounts.Completed,
            statusCounts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching assignment statistics",
            error: error.message
        });
    }
};

module.exports = {
    assignTask,
    assignMultipleUsers,
    assignMultipleTasks,
    getAllAssignments,
    // getAssignmentById,
    getUsersByTask,
    getTasksByUser,
    getMyAssignedTasks,
    updateAssignmentStatus,
    changeAssignedUser,
    removeUserFromTask,
    removeAllUsersFromTask,
    removeTaskFromUser,
    getUnassignedTasks,
    getUsersWithoutTasks,
    getAssignmentsByStatus,
    // getAssignmentCount,
    // assignmentDashboard
}