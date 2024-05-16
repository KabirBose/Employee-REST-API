// Dependencies
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Routers
const apiRouter = require("./api/api");

// More dependencies
const app = express();
const port = 3000;
app.use(express.json());

// Connect to DB
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRouter);

// Listen to localhost:port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
