const express = require("express");
const {
  register,
  login,
  getUserInfo,getAllUsers,
  updateProfileStatus,
  getUserProfileById,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const {auth} = require('../middleware/auth')
const uploadImage = require('../middleware/multer')
const router = express.Router();

router.post("/register",uploadImage.single('imgPath'), register);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers)

router.get("/getUserInfo",auth, getUserInfo);
router.get("/getUserProfileById/:ID",auth, getUserProfileById);
router.put("/updateProfileStatus/:ID", updateProfileStatus);
router.put("/updateProfile/:id",uploadImage.single('imgPath'),updateProfile)

router.patch('/changePassword/:ID',auth,changePassword)
//totalNumberOfUSers

module.exports = router;