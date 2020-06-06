"use strict"; 
const express = require('express'); 
const app = express(); 

app.get('/socket', (req, res) => {    
   res.status(200).send('Hello world!');
});

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
  console.log("New client connected");

  //Here we listen on a new namespace called "incoming data"
  socket.on("incoming data", (data) => {
      //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
      socket.broadcast.emit("outgoing data", {num: data});
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.listen(process.env.PORT);