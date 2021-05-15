const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

const auditlog = require("../middleware/auditlog");

router.post("/users", async (req, res) => {
  const user = new User({
    ...req.body,
  });

  user.perms = {
    see_pics: true,
    admin: false,
    see_props: false,
    edit_pics: false,
    edit_props: false,
    see_todo: false,
    edit_todo: false,
  };

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(401).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.cookie("auth_token", token);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: true });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    return res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.path("/users/me", auth, async (req, res) => {
//   res.send(req.user);
// });

// router.patch("/users/me", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedupdates = ["name", "email", "password", "age"];

//   const isValidOperation = updates.every((update) =>
//     allowedupdates.includes(update)
//   );

//   if (!isValidOperation)
//     return res.status(400).send({ error: "Invalid operation" });

//   try {
//     updates.forEach((update) => (req.user[update] = req.body[update]));

//     await req.user.save();

//     res.send(req.user);
//   } catch (error) {
//     res.status(400).send();
//   }
// });

//?limit=10 => anzahl der user
//?name="" => name des users
//? skip=1 => page
//http://localhost:3001/users/all/admin?skip=0&limit=1&name=Jonas%20Liebegott
router.get("/users/all/admin", auth, auditlog, async (req, res) => {
  if (!req.user.perms.admin)
    return res.status(400).send({ error: "You are not permitted to do this." });
  const name = req.query.name !== undefined ? { name: req.query.name } : {};

  const { limit, skip } = req.query;
  const options = { limit: parseInt(limit), skip: parseInt(skip) };

  // console.log(
  //   "name: " + JSON.stringify(name) + "options: " + JSON.stringify(options)
  // );

  try {
    const a = await User.find(name)
      .limit(options.limit)
      .skip(options.skip)
      .select({ name: 1, _id: 1, perms: 2 });

    res.send(a);
  } catch (e) {
    console.error(e);
  }
});

router.delete("/users/me", auth, auditlog, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});
// gets the permissions for an user
router.get("/users/me/auth", auth, auditlog, async (req, res) => {
  res.send({ ...req.user.perms });
});
// updates a user
router.patch("/users/:id", auth, auditlog, async (req, res) => {
  if (!req.user.perms.admin)
    return res.status(400).send({ error: "You are not permitted to do this." });

  try {
    var usertoupdate = await User.findById({ _id: req.params.id });

    const updates = Object.keys(req.body).forEach((key) => {
      if (!perms.includes(key)) return;

      usertoupdate.perms = {
        ...usertoupdate.perms,
        key: updates[key],
      };
    });
    usertoupdate.save();
    res.send({ perms: usertoupdate.perms });
  } catch (error) {}
});

router.patch("/users/update/admin", auth, auditlog, async (req, res) => {
  if (!req.user.perms.admin)
    return res.status(400).send({ error: "You are not permitted to do this." });

  const validUpdates = [
    "see_pics",
    "admin",
    "see_props",
    "edit_pics",
    "edit_props",
    "see_todo",
    "edit_todo",
  ];
  try {
    const a = await req.body.map(async (key) => {
      key.perms = Object.fromEntries(
        Object.entries(key.perms).filter(([keya]) =>
          validUpdates.includes(keya)
        )
      );

      var d = await User.findById({ _id: key._id });
      d.perms = key.perms;
      const ggg = await d.save();

      return ggg;
    });

    res.send(a);
  } catch (e) {
    resstatus(500).send();
  }
});

module.exports = router;
