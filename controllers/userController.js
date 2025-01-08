import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const postSignUp = async (req, res) => {
  try {

    const { name, city, country, userEmail, password, verificationToken } = req.body;

    if (!name || !city || !country || !userEmail || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry time

    const user = new User({
      name,
      city,
      country,
      userEmail,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry
    });

    // console.log(user)

    const savedUser = await user.save();

    // Exclude password and verification token from response
    const { password: _, verificationToken: __, ...userWithoutSensitiveData } = savedUser.toObject();

    return res.status(201).json({ message: "User saved successfully", data: userWithoutSensitiveData });
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

    // Check if the user's email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email before logging in." });
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

    // Exclude sensitive fields (password, isEmailVerified, verificationToken, verificationTokenExpiry)
    const { password: _, isEmailVerified: __, verificationToken: ___, verificationTokenExpiry: ____, ...userWithoutSensitiveData } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,   // Include the access token in the response
      refreshToken,  // Include the refresh token in the response
      user: userWithoutSensitiveData,  // Send user details except password
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


export const getVerifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    // Validate query parameters
    if (!token || !email) {
      return res
        .status(400)
        .json({ error: "Token and Email are required for email verification." });
    }

    // Fetch user by email
    const user = await User.findOne({ userEmail: email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ error: "Email is already verified." });
    }

    // Check if the verification token has expired
    if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
      return res.status(400).json({ error: "Verification token has expired." });
    }

    // Verify the token
    if (user.verificationToken !== token) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token." });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.verificationToken = null; // Clear the token
    user.verificationTokenExpiry = null; // Clear the verification token expiry
    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Error during email verification:", err.message);
    return res
      .status(500)
      .json({ error: "Server error during email verification." });
  }
};


// Get user profile details
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    // Fetch the user by ID
    const user = await User.findById(userId).select("-password -refreshToken -isEmailVerified -verificationToken -verificationTokenExpiry"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ message: "User profile fetched successfully.", data: user });
  } catch (err) {
    console.error("Error [Get User Profile]:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user profile
export const putUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // Extract the authenticated user ID

    const { name, city, country, password } = req.body; // Destructure the updated fields

    // Check if user ID is present
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    // Validate required fields
    if (!name || !city || !country) {
      return res.status(400).json({ error: "Name, city, and country are required." });
    }

    // Fields to update
    const updatedFields = { name, city, country };

    // Hash and update password only if it's provided
    if (password) {
      if (password.trim() === "") {
        return res.status(400).json({ error: "Password cannot be empty." });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedFields.password = hashedPassword;
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields }, // Use $set to avoid accidentally replacing the document
      { new: true, runValidators: true } // Return the updated document
    ).select("-password -refreshToken -isEmailVerified -verificationToken -verificationTokenExpiry"); // Exclude sensitive fields

    // If user not found
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "User profile updated successfully.", data: updatedUser });
  } catch (err) {
    console.error("Error [Update User Profile]:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
