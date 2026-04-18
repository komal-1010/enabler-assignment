const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://69e36c6181d0b50009954b87--enabler-app.netlify.app",
      "https://enabler-app.netlify.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

app.use("/api", uploadRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});