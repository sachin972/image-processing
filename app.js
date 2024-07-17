const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use(
  "/processed_images",
  express.static(path.join(__dirname, "processed_images"))
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
