import { Server } from "socket.io";
import { verifyToken } from "../utils/token.js";

const activeUsers = new Map(); // userId → set(socket.id)

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  //Middleware for authentication
  io.use((socket, next) => {
    try {
      //const token = socket.handshake.auth.token;
      const authHeader = socket.handshake.headers.authorization;

      const token = authHeader?.split(" ")[1];

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = verifyToken(token);
      socket.user = decoded;

      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.userId;
    const userKey = String(userId);

    console.log(`user connected: ${userId}`);

    //store active user in set to allow multiple connections per user
    if (!activeUsers.has(userKey)) {
      activeUsers.set(userKey, new Set());
    }

    activeUsers.get(userKey).add(socket.id);
    console.log("Active users:", Array.from(activeUsers.keys()));

    //message handler
    socket.on("message", ({ to, content }) => {
        try {
            console.log("Incoming message:", { from: userId, to, content });

            const targetSocketIds = activeUsers.get(String(to));

            if (targetSocketIds && targetSocketIds.size > 0) {
                targetSocketIds.forEach((socketId) => {
                    io.to(socketId).emit("message", {
                        from: userId,
                        content,
                    });
                });
            } else {
                socket.emit("error", {
                    message: "User is offline",
                });
            }
        } catch (err) {
            console.error("Message error:", err);
        }
    });

    //disconnect
    socket.on("disconnect", () => {
      console.log(`user disconnected: ${userId}`);

      if (activeUsers.has(userKey)) {
        activeUsers.get(userKey).delete(socket.id);

        // remove user if no sockets left
        if (activeUsers.get(userKey).size === 0) {
          activeUsers.delete(userKey);
        }
      }

    });
  });

  return io;
};