// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", require("./routes/authRoutes"));

// module.exports = app;



const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.url);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
