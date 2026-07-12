const express = require('express')
const {
    createTask,
    getAllTasks,
    getTaskByID,
    updateStatus,
    updateTask,
    deleteTask,
    getTotalTasks, getTotalCompletedTasks, getTotalPendingTasks, getTotalInProgressTasks
} = require('../controllers/taskController')
const { auth, admin } = require('../middleware/auth')
const uploadFiles = require('../middleware/docMulter')

const router = express.Router()

router.post('/createTask', auth, admin, uploadFiles.single('docPath'), createTask)
router.get('/getAll', auth, getAllTasks)
router.get('/getTaskByID/:ID', auth, getTaskByID)
router.patch('/updateStatus/:ID', auth, updateStatus)
router.put('/updateTask/:ID', auth, admin, uploadFiles.single("docPath"), updateTask)
router.delete('/delete/:ID', auth, admin, deleteTask)

router.get('/getTotalTasks', getTotalTasks)
router.get('/getTotalCompletedTasks', getTotalCompletedTasks)
router.get('/getTotalPendingTasks', getTotalPendingTasks)
router.get('/getTotalInProgressTasks', getTotalInProgressTasks)


module.exports = router


