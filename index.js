const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log(`running on port, ${port}`);
});
