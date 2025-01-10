import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    maxlength: [100, "City name cannot exceed 100 characters"]
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    maxlength: [100, "Country name cannot exceed 100 characters"]
  },
  userEmail: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address (e.g., user@example.com).",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/.test(value);
      },
      message:
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (e.g., !, @, #, $, etc.).",
    },
  },
  refreshToken: {
    type: String,
    default: null, // Default to null if no refresh token is set
  },
  isEmailVerified: {
    type: Boolean,
    default: false, // Set to false until the email is verified
  },
  verificationToken: {
    type: String,
    default: null, // Token used for email verification
  },
  verificationTokenExpiry: {
    type: Date,
    default: null, // Expiry date for the verification token
  },
});

// Add timestamps for createdAt and updatedAt fields
UserSchema.set("timestamps", true);

const User = mongoose.model('User', UserSchema);
export default User;

