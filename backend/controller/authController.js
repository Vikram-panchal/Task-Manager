const User = require("../models/models.User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../middlewares/cloudinary");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let uploadResponse = "";
    if (profileImageUrl) {
      uploadResponse = await cloudinary.uploader.upload(profileImageUrl);
    }

    // Role assignment
    if (!adminInviteToken || adminInviteToken !== process.env.ADMIN_INVITE_TOKEN && adminInviteToken !== process.env.MEMBER_INVITE_CODE) {
      return res.status(400).json({ message: "Please enter the valid invite code." });
    }

    let role = "";

    if (adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
      role = "admin";
    } else if (adminInviteToken === process.env.MEMBER_INVITE_CODE) {
      role = "member";
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl: uploadResponse.secure_url,
      role,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(500).json({ message: "Failed to create user." });
    }
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user by email && Compare Password
    const user = await User.findOne({ email });
    isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!user && !isPasswordMatched) {
      return res.status(400).json({ message: "Invalide Credentials" });
    }

    //Return user data
    if (user && isPasswordMatched) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Server Error", message: error.message });
  }
};
// get user profile
const getUserProfile = async (req, res) => {
  try {
    // console.log(req.user)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Server Error", message: error.message });
  }
};
// update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(400).json({ message: "Server Error", message: error.message });
  }
};
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
