"use strict"; 
const express = require('express'); 
const http = require('http');
const socketIo = require("socket.io");
const { PubSub } = require('@google-cloud/pubsub');

// Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 8082;

io.on("connection", (socket) => {
  console.log(`New client ${port} connected`);
  listenForMessages();
  socket.on("disconnect", () => {
    console.log(`Client ${port} disconnected`);
  });
});

const socketSubscription = 'socket-sub';
const timeout = 60;

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages() {
  // References an existing subscription
  const subscription = pubSubClient.subscription(socketSubscription);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    
    if (messageCount > 0 && JSON.parse(message.data) !== undefined) {
      io.sockets.emit("comment-updates", JSON.parse(message.data));
    }

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

server.listen(port, () => console.log(`Listening on port ${port}`));
