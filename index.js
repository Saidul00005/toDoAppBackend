require('./utils/databaseUtil'); // Initialize database connection
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const toDoRouter = require('./routes/toDoRouter');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://your-frontend-url.com", // Replace with your frontend's URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use(userRouter);
app.use(toDoRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
