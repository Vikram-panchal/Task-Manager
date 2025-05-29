const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controller/authController");
const { Protect } = require("../middlewares/authMiddleware");

const router = express.Router();

//Auth Routes 

router.post("/register", registerUser); //register user
router.post("/login", loginUser); //login user
router.get("/profile",Protect, getUserProfile); //get user profile
router.put("/profile",Protect, updateUserProfile); //update user profile

module.exports = router