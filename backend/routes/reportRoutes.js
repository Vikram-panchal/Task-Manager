const express = require("express");
const { Protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controller/reportContoller");


const router = express.Router();

router.get("/export/tasks", Protect, adminOnly, exportTasksReport);
router.get("/export/users", Protect, adminOnly, exportUsersReport);

module.exports = router;