import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const postSignUp = async (req, res) => {
  try {

    const { name, city, country, userEmail, password } = req.body;

    if (!name || !city || !country || !userEmail || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      city,
      country,
      userEmail,
      password: hashedPassword,
    });

    // console.log(user)

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

    // Generate JWT access token
    const token = jwt.sign(
      { id: user._id, email: user.userEmail }, // Payload: user id and email
      process.env.JWT_SECRET,  // Use a secret key from environment variables
      { expiresIn: '1h' } // Token expiration (1 hour)
    );

    // Generate JWT refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.userEmail }, // Payload: user id and email
      process.env.JWT_REFRESH_SECRET, // Separate secret key for refresh tokens
      { expiresIn: '7d' } // Token expiration (7 days)
    );

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return user details and tokens (exclude password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,   // Include the access token in the response
      refreshToken,  // Include the refresh token in the response
      user: userWithoutPassword,  // Send user details except password
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


export const postRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid or expired refresh token." });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.userEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error during token refresh:", err.message);
    res.status(403).json({ error: "Invalid or expired refresh token." });
  }
};