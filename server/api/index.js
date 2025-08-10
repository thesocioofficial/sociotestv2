import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "../routes/userRoutes.js";
import eventRoutes from "../routes/eventRoutes.js";
import festRoutes from "../routes/festRoutes.js";
import registrationRoutes from "../routes/registrationRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app', // Replace with your actual Vercel domain
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/fests", festRoutes);
app.use("/api", registrationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Socio API Server", version: "1.0.0" });
});

// For Vercel serverless deployment
export default app;
