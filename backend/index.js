// const express = require('express');
// const app = express();
// const PORT = 4000;

// const http = require('http').Server(app);
// const cors = require('cors');

// app.use(cors());

// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: "http://localhost:3000"
//     }
// });

// //Add this before the app.get() block
// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);
//     socket.on('disconnect', () => {
//       console.log('🔥: A user disconnected');
//     });

//     socket.on('updateHighestBid', (data) => {
//       console.log(data); //logs the message from the client
//     });
// });

// app.get('/api', (req, res) => {
//   res.json({
//     message: 'Hello world',
//   });
// });

// http.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();
// const PORT = 4000;

// mongoose
//     .connect("mongodb://127.0.0.1:27017/auctionApp")
//     .then(() => console.log("Connected!"))
//     .catch(err => console.log(`Connection Failed! ${err}`))

// app.get("/api", (req, res) => {
//     res.json({
//         message: "Hello world",
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });
