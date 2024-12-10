import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const postSignUp = async (req, res) => {
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


export const postLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ userEmail: email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign(
      { id: user._id, email: user.userEmail }, // Payload: user id and email
      process.env.JWT_SECRET,  // Use a secret key from environment variables
      { expiresIn: '24h' } // Token expiration (1 day)
    );

    // Return user details and JWT token (exclude password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,   // Include the token in the response
      user: userWithoutPassword,  // Send user details except password
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
