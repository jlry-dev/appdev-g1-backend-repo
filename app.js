const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`\n Server has started, listening at port ${PORT}\n`);
});
