require("dotenv").config();
const express = require("express");

require("./db/mongoose");
const userRouter = require("./Routers/user");
const roomRouter = require("./Routers/room");

const cookieParser = require("cookie-parser");
const User = require("./models/user");

const app = express();

//variabelen

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routers
app.use(userRouter);
app.use("/rooms", roomRouter);

module.exports = app;
