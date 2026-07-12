const express = require('express')
const {auth, admin} =require('../middleware/auth')
const uploadFiles = require('../middleware/docMulter')
const {
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
} = require("../controllers/taskAssignmentController");

const router = express.Router()

router.post("/assignTask", auth, assignTask);

router.post("/assignMultipleUsers", auth,admin, assignMultipleUsers);  

router.post("/assignMultipleTasks", auth, admin, assignMultipleTasks);

router.get("/getAllAssignments", auth, getAllAssignments);

// router.get("/getAssignment/:ID", auth, getAssignmentById);

router.get("/getUsersByTask/:task_id", auth, getUsersByTask);

router.get("/getTasksByUser/:user_id", auth, getTasksByUser);

router.get("/myAssignedTasks", auth, getMyAssignedTasks);

router.patch("/updateAssignmentStatus/:ID", auth, updateAssignmentStatus);

router.put("/changeAssignedUser/:ID", auth, admin, changeAssignedUser);

router.delete("/removeUserFromTask/:ID", auth, admin, removeUserFromTask);

router.delete("/removeAllUsersFromTask/:TASK_ID", auth, admin, removeAllUsersFromTask);

router.delete("/removeTaskFromUser/:USER_ID/:TASK_ID", auth, admin, removeTaskFromUser);

router.get("/getUnassignedTasks", auth, admin, getUnassignedTasks);

router.get("/getUsersWithoutTasks", auth, admin, getUsersWithoutTasks);

router.get("/getAssignmentsByStatus", auth, getAssignmentsByStatus);

// router.get("/getAssignmentCount", auth, admin, getAssignmentCount);

// router.get("/dashboard", auth, admin, assignmentDashboard);


module.exports = router