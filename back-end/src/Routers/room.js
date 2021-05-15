const express = require("express");
const auth = require("../middleware/auth");
const Room = require("../models/room");
const multer = require("multer");
const sharp = require("sharp");
const auditlog = require("../middleware/auditlog");

//set up router
const router = new express.Router();

//multer set Up for pics

const upload = multer({
  limits: {
    fieldSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be a jpg jpeg png"));
    }

    cb(undefined, true);
  },
});

//router routes
router.post("/", auth, auditlog, async (req, res) => {
  try {
    if (!req.user.perms.admin) {
      return res
        .status(400)
        .send({ error: "You are not permitted to do this" });
    }

    const room = new Room({
      ...req.body,
      props: {},
      buckedlist: {},
    });

    const done = await room.save();
    res.status(200).send(done);
  } catch (error) {
    res.status(500).send();
  }
});
//get the name of all rooms

router.get("/", async (req, res) => {
  try {
    const a = await Room.find({}, { name: 1 });

    res.send(a);
  } catch (error) {
    res.status(500).send();
  }
});

//gets the information for an room
router.get("/:room", auth, auditlog, async (req, res) => {
  const roomName = req.params.room;

  try {
    const room = await Room.findOne({ name: roomName });

    if (!room) return res.status(400).send({ error: "Room not found" });

    if (req.user.perms.admin) {
      const { name, pics, props, buckedlist } = room;

      return res.send({ name, pics, props, todos: buckedlist });
    }

    let information = { name: room.name };
    if (req.user.perms.see_pics) information.pics = room.pics;
    if (req.user.perms.see_props) information.props = room.props || {};
    if (req.user.perms.see_todo) information.todos = room.buckedlist || {};

    res.send({ ...information });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/:room/admin", auth, auditlog, async (req, res) => {
  //valid stuff
  var validUpdates = [];
  if (req.user.perms.admin) {
    validUpdates = ["props", "buckedlist"];
  } else {
    if (req.user.perms.edit_todo) {
      validUpdates.push("buckedlist");
    }
    if (req.user.perms.edit_props) {
      validUpdates.push("props");
    }
  }

  //stuff
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
  auditlog,
  upload.single("pic"),
  async (req, res) => {
    if (!(req.user.perms.edit_pics || req.user.perms.admin))
      return res.status(400).send({ error: "you are not permitted to update" });

    if (undefined === req.file)
      return res.status(400).send({ error: "Du musst eine file angeben" });

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1920, height: 1080 })
      .png()
      .toBuffer();

    const room = await Room.findOne({ name: req.params.room });

    room.pics.push({ pic: buffer });
    await room.save();

    res.send(room);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/:room/pic/admin", auth, auditlog, async (req, res) => {
  if (!(req.user.perms.edit_pics || req.user.perms.admin))
    return res.status(400).send({ error: "you are not permitted to update" });

  const delbil = req.body;

  try {
    var room = await Room.findOne({ name: req.params.room });

    room.pics = room.pics.filter((pic) => !delbil.includes(String(pic._id)));

    room.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
