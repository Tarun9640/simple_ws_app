import express from "express";
import dotenv from "dotenv";
import http from "http";
import sequelize, { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import { initSocket } from "./websocket/socket.js";

dotenv.config();

const app = express();

//  middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const server = http.createServer(app);
initSocket(server);

app.use(errorMiddleware);

const start = async () => {
  await connectDB();

  await sequelize.sync(); // creates tables 

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

start();