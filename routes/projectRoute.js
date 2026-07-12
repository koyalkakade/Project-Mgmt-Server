const express = require('express')
const  {
createproject,
getAllprojects,
getprojectByID,
updateStatus,
updateproject,
daleteproject,
getTotalprojects
} = require('../controllers/projectController')
const {auth, admin, hod} =require('../middleware/auth')

const router = express.Router()

router.post('/create',auth, hod,createproject)
router.get('/getAll',auth, getAllprojects)
router.get('/getproject/:ID',auth, getprojectByID)
router.patch('/updateStatus/:ID', auth,hod,updateStatus)
router.put('/updateproject/:ID',auth,hod, updateproject)
router.delete('/delete/:ID',auth,admin, daleteproject)
router.get('/getTotalprojects',auth,getTotalprojects)


// 1. /getCompletedprojects s
// 2. /getPendingproject 
// 3. /getInPRogressproject 

// 1. /getprojectsByStatus.    ?status=""

// 2. /getprojectsBySelectedMonth 



//getTotalprojects
//getTotalCompletedproject
//getTotalInprogressproject 
//getTotalPendingProjects


module.exports = router


// http://localhost:7005/project/create 
// {
//     "title":"Learn MERN",
//     "Description":"ert dfghj tyui bnm",
//     "startDate":"2026-06-10",
//     "endDate":"2026-06-30",

// }