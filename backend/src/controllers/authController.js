const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");
const { encrypt, decrypt } = require("../utils/encrypt");

exports.register = async (req, res) => {
    console.log("✅ register controller hit");
    console.log("BODY:", req.body);
    const { name, email, password, aadhaar } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAadhaar = encrypt(aadhaar);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        aadhaar: encryptedAadhaar
    });

    res.status(201).json({
        token: generateToken(user._id)
    });
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
        token: generateToken(user._id)
    });
};



exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
        name: user.name,
        email: user.email,
        aadhaar: decrypt(user.aadhaar)
    });
};
