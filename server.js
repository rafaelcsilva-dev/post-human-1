const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(__dirname));

let onlineUsers = {};

io.on("connection", (socket) => {
  onlineUsers[socket.id] = { x: 0, y: 0 };

  // Atualiza contagem para todos
  io.emit("updateCount", Object.keys(onlineUsers).length);

  socket.on("mouseMove", (data) => {
    if (onlineUsers[socket.id]) {
      onlineUsers[socket.id].x = data.x;
      onlineUsers[socket.id].y = data.y;
      // Envia posições para os outros
      socket.broadcast.emit("userPositions", onlineUsers);
    }
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("updateCount", Object.keys(onlineUsers).length);
  });
});

server.listen(3000, () => console.log("Servidor rodando na porta 3000"));
