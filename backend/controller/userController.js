const Task = require("../models/models.task");
const User = require("../models/models.User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Get All Users Admin Only

const getUsers = async (req, res) => {
    try {
        const users = await User.find({role: "member"}).select("-password");
        
        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
                const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });
                const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
                return { ...user._doc, pendingTasks, completedTasks, inProgressTasks };
            })
        )
        res.status(200).json(userWithTaskCounts);
    } catch (error) {
        res.status(400).json({ message: "Server Error", message: error.message });
    }
};

//Get user by id 

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "Server Error", message: error.message });
    } 
}

//Delete User Admin Only

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.remove();
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(400).json({ message: "Server Error", message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
};