const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Room = require("../../src/models/room");

//User fixtuers
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Jonas1",
  email: "l.jonas@web.de",
  password: "Jojoasdggjo ich bins",
  authstufe: 10,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Jonasasdf1",
  email: "jonasda@web.de",
  password: "Jojoasadsfdggjo ich bins",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

// Room fixtuers
const roomOneId = new mongoose.Types.ObjectId();
const roomOne = {
  _id: roomOneId,
  name: "roome One",
  props: {
    operatingSystem: "Linux",
    Board: "gen 1",
    Computer: "new",
  },
  buckedlist: {},
};
const roomTwoId = new mongoose.Types.ObjectId();
const roomTwo = {
  _id: roomTwoId,
  name: "roome Two",
  props: {
    operatingSystem: "Linux",
    Board: "gen 1",
    Computer: "new",
  },
  buckedlist: {},
};

const setUpDatabase = async () => {
  //User setUpDatabasew
  await User.deleteMany();
  await Room.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  //Room setUpDatabase

  await new Room(roomOne).save();
  await new Room(roomTwo).save();
};

module.exports = {
  userOneId,
  userOne,

  userTwo,
  userTwoId,

  roomOne,
  roomTwo,

  setUpDatabase,
};
