import './utils/databaseUtil.js'; // Initialize database connection
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import toDoRouter from './routes/toDoRouter.js';

dotenv.config(); // Load environment variables
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
