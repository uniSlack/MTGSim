const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your client
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true,
  },
});

let corsOptions = {
  origin: ["http://localhost:3000"]
};

app.get("/api", cors(corsOptions), (req, res) => {
  res.json({message: "Hello from server!"});
})

// Serve static images
app.use("/images", express.static(path.join(__dirname, "public", "images")));

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });

  // // Broadcast changes to other clients
  socket.on("card-dragged", (data) => {
    socket.broadcast.emit("card-dragged-update", data);
  });

  socket.on("card-tapped", (data) => {
    socket.broadcast.emit("card-tapped-update", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// handle other non-implemented gets
app.get('*', (req, res) => {
  console.log("Dropped request:", req.path)
  
//   // res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  console.log("Server listening on ", 3001);
});