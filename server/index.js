const express = require("express");
const path = require("path");
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();

let corsOptions = {
  origin: ['http://localhost:3000']
};

app.get("/api", cors(corsOptions), (req, res) => {
  res.json({message: "Hello from server!"});
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Serve static images
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// handle other non-implemented gets
app.get('*', (req, res) => {
  console.log("Dropped request")
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



