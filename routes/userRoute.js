const express = require("express");
const {
  register,
  login,
  getUserInfo,getAllUsers
//   updateProfile,
} = require("../controllers/userController");
const {auth} = require('../middleware/auth')
const uploadImage = require('../middleware/multer')
const router = express.Router();

router.post("/register",uploadImage.single('imgPath'), register);
router.post("/login", login);
router.get("/getUserInfo",auth, getUserInfo);
// // router.put("/updateProfile", updateProfile);

// router.get("/getAllUsers", getAllUsers)
// changePassword
//totalNumberOfUSers

module.exports = router;