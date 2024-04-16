import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors({ origin: "" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: "http://85.143.216.62:7778",
      methods: ["GET", "POST"],
   },
});

const users = [];

io.on("connection", (socket) => {
   console.log(`User ${socket.id} connect`);

   socket.on("message", (data) => {
      io.emit("response", data);
   });

   socket.on("newUser", (data) => {
      users.push(data);
      io.emit("responseNewUser", users);
   });

   socket.on("typing", (data) => socket.broadcast.emit("responseTyping", data));

   io.on("disconnect", () => {
      console.log(`User ${socket.id} disconnect`);
   });
});

server.listen(7777, () => {
   console.log("Server is running");
});
