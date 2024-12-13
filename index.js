import './utils/databaseUtil.js'; // Initialize database connection
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import toDoRouter from './routes/toDoRouter.js';
import helmet from 'helmet';

dotenv.config(); // Load environment variables
const app = express();

// Disable the "X-Powered-By" header
app.disable("x-powered-by");

// Use Helmet for setting secure HTTP headers
app.use(helmet());

const allowedOrigins = [process.env.FRONTEND_URL];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow no origin in certain cases like Postman
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600, // 10 minutes preflight cache duration
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
