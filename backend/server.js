import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join expense room
  socket.on("joinExpense", (expenseId) => {
    socket.join(`expense-${expenseId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io for controllers
export { io };

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});