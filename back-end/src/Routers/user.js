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

    return res.send({ done: true });
  } catch (e) {
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

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});
// gets the permissions for an user
router.get("/users/me/auth", auth, async (req, res) => {
  res.send({ ...req.user.perms });
});
// updates a user
router.patch("/users/:id", auth, async (req, res) => {
  if (!req.user.permissions.includes("admin"))
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

module.exports = router;
