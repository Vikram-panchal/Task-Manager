const express = require("express");
const { Protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controller/userController");

const router = express.Router();

//User management routes
router.get("/", Protect, adminOnly, getUsers);
router.get("/:id", Protect , getUserById);
router.delete("/:id", Protect, adminOnly, deleteUser);

module.exports = router;