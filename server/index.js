const express = require("express");
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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});



