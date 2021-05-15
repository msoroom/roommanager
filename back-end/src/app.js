require("dotenv").config();
const express = require("express");
const path = require("path");

require("./db/mongoose");
const userRouter = require("./Routers/user");
const roomRouter = require("./Routers/room");
const auditlog = require("./Utils/autditlog");

const cookieParser = require("cookie-parser");
const User = require("./models/user");

const app = express();

auditlog.setuplogs();
//variabelen

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routers

app.use("/api", userRouter);
app.use("/api/rooms", roomRouter);

process.env.file = path.join(
  __dirname,
  "/Utils/logs/" + new Date().toISOString().replace(":", "_", 2) + ".log"
);

process.on("beforeExit", () => {
  auditlog.writer();
  console.log("bye");
});

module.exports = app;
