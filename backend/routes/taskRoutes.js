const express = require("express");
const { Protect, adminOnly } = require("../middlewares/authMiddleware");
const {
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getTasks,
    getDashboardData,
    getUserDashboardData,
  } = require("../controller/taskController");

// Task Management Routes
const router = express.Router();

router.get("/dashboard-data", Protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", Protect, getUserDashboardData);
router.get("/", Protect, getTasks);
router.get("/:id", Protect, getTaskById);
router.post("/", Protect, adminOnly, createTask);
router.put("/:id", Protect, updateTask);
router.delete("/:id", Protect, adminOnly, deleteTask);
router.put("/:id/status", Protect, updateTaskStatus);
router.put("/:id/todo", Protect, updateTaskCheckList);

module.exports = router;