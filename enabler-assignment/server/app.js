const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");

const app = express();
app.use(cors());

app.options("*", cors());

app.use("/api", uploadRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});