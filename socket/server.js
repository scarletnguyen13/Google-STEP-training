"use strict"; 
const express = require('express'); 
const http = require('http');
const socketIo = require("socket.io");

// Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { origins: '*:*'});

const port = process.env.PORT || 8081;

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

app.get('/', function (req, res) {
  res.send('hello world');
})

app.post('/', function (req, res) {
  res.send('hello');
})

server.listen(port, () => console.log(`Listening on port ${port}`));
