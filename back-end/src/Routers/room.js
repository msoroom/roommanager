const express = require("express");
const auth = require("../middleware/auth");
const Room = require("../models/room");
const multer = require("multer");
const sharp = require("sharp");

//set up router
const router = new express.Router();

//multer set Up for pics

const upload = multer({
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be a jpg jpeg png"));
    }

    cb(undefined, true);
  },
});

//router routes
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.authstufe < 7) {
      return res
        .status(400)
        .send({ error: "You are not permitted to do this" });
    }

    const room = new Room({
      ...req.body,
    });

    const done = await room.save();
    res.status(200).send(done);
  } catch (error) {
    res.status(500).send();
  }
});
//get the name of all rooms

router.get("/", async (req, res) => {
  const a = await Room.find({}, { name: 1 });

  res.send(a);
});

//gets the information for an room
router.get("/:room", async (req, res) => {
  const roomName = req.params.room;

  try {
    const room = await Room.findOne({ name: roomName });

    if (!room) return res.status(400).send({ error: "Room not found" });

    res.status(200).send({ name: room.name, pics: room.pics });
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/:room/admin", auth, async (req, res) => {
  const roomName = req.params.room;
  try {
    if (req.user.authstufe < 7)
      throw new Error("you are not permitted to do this");

    const room = await Room.findOne({ name: roomName });

    if (!room) return res.status(400).send({ error: "Room not found" });

    res.status(200).send(room);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/:room/admin", auth, async (req, res) => {
  //valid stuff
  const validUpdates = ["name", "props", "buckedlist"];

  if (req.user.authstufe < 9)
    return res.status(400).send({ error: "you are not permitted to update" });
  const roomname = req.params.room;
  var updates = req.body;

  try {
    var room = await Room.findOne({ name: roomname });

    updates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => validUpdates.includes(key))
    );
    Object.assign(room, room, updates);
    room.save();
    res.send(room);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/:room/admin/pics",
  auth,
  upload.single("pic"),
  async (req, res) => {
    if (req.user.authstufe < 9)
      return res.status(400).send({ error: "you are not permitted to update" });

    if (undefined === req.file)
      return res.status(400).send({ error: "Du musst eine file angeben" });

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1920, height: 1080 })
      .png()
      .toBuffer();

    const room = await Room.findOne({ name: req.params.room });

    room.pics = room.pics.concat({ pic: buffer });
    await room.save();

    res.send(room);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
