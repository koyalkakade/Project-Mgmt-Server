const { time } = require('node:console')
const Task = require("../models/taskModel")
const { title } = require('node:process')
const { validateProject } = require('../services/projectValidation')

async function createTask(req, res) {
//    console.log(req.body);
// console.log(req.file);
    const { title, description, startDate, endDate, project_ID } = req.body
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, msg: "Please upload file" })
        }
        const pValidate = await validateProject({ title, description, startDate, endDate, department: "Development" })
        if (!pValidate.success) {
            return res.status(400).send(pValidate);
        }

        let docPath = `/uploads/taskFiles/${req.file.filename}`;
        // console.log('******', docPath)

        const newTask = await Task.create({
            project_ID: project_ID,
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            docPath: docPath,
            createdBy: req.user.id
        })
        //console.log(newTask)
        await newTask.save()

        res.status(200).send({ msg: "Task created successfully", success: true })
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

async function getAllTasks(req, res) {
    try {
        //console.log('task controller--')
        const tasks = await Task.find()
            .populate("project_ID", "title department status")
            .populate("createdBy", "name email role");

        res.status(200).send({
            success: true,
            tasks
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function getTaskByID(req, res) {
    try {
        const ID = req.params.ID;
//console.log(req.params)
        const task = await Task.findById(ID)
            .populate("project_ID", "title department status")
            .populate("createdBy", "name email role");

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        // Convert mongoose document to plain object
        const taskData = task.toObject();

        // Absolute URL for downloading document
        if (taskData.docPath) {
            taskData.docPath = process.env.SERVER_URL+taskData.docPath;
        }

        res.status(200).send({
            success: true,
            task:taskData
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            msg: "Server Error"
        });
    }
}

async function updateStatus(req, res) {
    try {
        const ID = req.params.ID
       // console.log(ID,'..')
        const taskById = await Task.findById(ID)
        if (!taskById) {
            return res.status(400).send({ success: false, msg: "Project not found" })
        }
        const { status } = req.body
        const updatedTask = await Task.findByIdAndUpdate(ID, { status: status })
        if (!updatedTask) {
            return res.status(400).send({ success: false, msg: "Task not updated" })
        }
        return res.status(200).send({ success: true, msg: "Task updated successfuly" })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ msg: "Server Error" })
    }
}

async function updateTask(req, res) {
    try {
        console.log(req.body,'update task')
        const ID = req.params.ID;
        const taskForUpdate = await Task.findById(ID);
        if (!taskForUpdate) {
            return res.status(404).json({ message: 'task not found', success: false });
        }
        // console.log(req.body.title, 'update task data......', taskForUpdate)
        await Task.findByIdAndUpdate(ID,
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        )

        res.status(200).send({ msg: "task update successfully", success: true })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ msg: "server error", success: false })
    }
}
async function deleteTask(req, res) {
    try {

        const ID = req.params.ID;

        const task = await Task.findById(ID);

        if (!task) {
            return res.status(404).send({
                success: false,
                msg: "Task not found"
            });
        }

        await Task.findByIdAndDelete(ID);

        return res.status(200).send({
            success: true,
            msg: "Task deleted successfully"
        });
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

async function getTotalTasks(req, res) {
    try {
        const totalTasks = await Task.countDocuments();

        res.status(200).send({
            success: true,
            total: totalTasks
        });
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

async function getTotalCompletedTasks(req, res) {
    try {
        const result = await Task.countDocuments({
            status: "Completed",
        });

        res.status(200).json({
            success: true,
            task: result,
        });
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

async function getTotalPendingTasks(req, res) {
    try {
         const result = await Task.countDocuments({
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      task: result,
    });
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

async function getTotalInProgressTasks(req, res) {
    try {
         const result = await Task.countDocuments({
      status: "InProgress",
    });

    res.status(200).json({
      success: true,
      task: result,
    });
    }
    catch (error) {
        res.status(500).send({ msg: "server error", success: false })
    }
}

module.exports = {
    createTask, getAllTasks, getTaskByID,
    updateStatus, updateTask, deleteTask, getTotalTasks,
    getTotalCompletedTasks, getTotalPendingTasks, getTotalInProgressTasks
}