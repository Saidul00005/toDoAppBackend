const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignUp = async (req, res) => {
  try {
    // console.log(req.body)
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      userEmail,
      password: hashedPassword,
    });


    const savedUser = await user.save();

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return res.status(201).json({ message: "User saved successfully", data: userWithoutPassword });
  } catch (err) {
    console.error("Error [User Save]", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.postLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ userEmail: email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Return user details (exclude sensitive fields like password)
    res.status(200).json({
      id: user._id,
      email: user.userEmail,
      //name: user.name  
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
