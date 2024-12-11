import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address (e.g., user@example.com).",
    ], // Matches the email pattern in your Input component
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/.test(value);
      },
      message: "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (e.g., !, @, #, $, etc.).",
    }, // Matches the password pattern in your Input component
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
