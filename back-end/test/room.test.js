const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const Room = require("../src/models/room");
const {
  userOneId,
  userOne,
  userTwo,
  roomOne,
  roomTwo,
  roomeOnePicID,
  setUpDatabase,
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create a room", async () => {
  const props = {
    operatingSystem: "Linux",
    Board: "gen 1",
    Computer: "new",
  };

  const response = await request(app)
    .post("/rooms")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({
      name: "abcaaa",
      props,
    })
    .expect(200);
});

test("Should not create a new room", async () => {
  //cause it exists by name
  let response = await request(app)
    .post("/rooms")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({ roomOne })
    .expect(500);

  //cause user is not permitted to do this
  response = await request(app)
    .post("/rooms")
    .set("Cookie", "auth_token=" + userTwo.tokens[0].token)
    .send()
    .expect(400);
});
test("Should get a room as an admin ", async () => {
  var response = await request(app)
    .get("/rooms/" + roomOne.name)
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send()
    .expect(200);

  expect(response.body.name).toBe(roomOne.name);
});
test("Should get a room with given perms", async () => {
  var response = await request(app)
    .get("/rooms/" + roomOne.name)
    .set("Cookie", "auth_token=" + userTwo.tokens[0].token)
    .send()
    .expect(200);
});

test("Should not get a room ", async () => {
  var response = await request(app)
    .get("/rooms/not a room")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send()
    .expect(400);

  expect(response.body.name).toBeUndefined();
});

test("Should update the mentioned room with only the walid params", async () => {
  const updates = {
    name: "neuer name",
    props: {
      operatingSystem: undefined,
      Board: "gen 2",
      Usbstick: "alpa",
    },
    buckedlist: {
      laufwerk: true,
    },
    stupid: true,
  };
  //mit admin permissions

  const response = await request(app)
    .patch("/rooms/" + roomOne.name + "/admin")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({ ...updates })
    .expect(200);

  expect(response.body.name).not.toBe(updates.name);
  expect(response.body.props).toEqual(updates.props);
  expect(response.body.stupid).toBeUndefined();
  expect(response.body.buckedlist.laufwerk).toBe(true);

  const room = await Room.findById({ _id: roomOne._id });

  expect(room.name).not.toBe(updates.name);
  expect(room.props).toEqual(updates.props);
  expect(room.stupid).toBeUndefined();
  expect(room.buckedlist.laufwerk).toBe(true);

  await setUpDatabase();

  // if the user only has the perms to update a certain prop
  const response2 = await request(app)
    .patch("/rooms/" + roomOne.name + "/admin")
    .set("Cookie", "auth_token=" + userTwo.tokens[0].token)
    .send({ ...updates })
    .expect(200);

  expect(response2.body.name).not.toBe(updates.name);
  expect(response2.body.props).toEqual(updates.props);
  expect(response2.body.stupid).toBeUndefined();
  expect(response2.body.buckedlist).toBeUndefined();

  const room2 = await Room.findById({ _id: roomOne._id });

  expect(room2.name).not.toBe(updates.name);
  expect(room2.props).toEqual(updates.props);
  expect(room2.stupid).toBeUndefined();
  expect(room2.buckedlist).toBeUndefined();
});

test("should upload a new picture for a room", async () => {
  const response = await request(app)
    .post("/rooms/" + roomOne.name + "/admin/pics")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .attach("pic", "test/fixtures/profile-pic.jpg")
    .expect(200);
});

test("should not upload a new picture for a room", async () => {
  const response = await request(app)
    .post("/rooms/" + roomOne.name + "/admin/pics")
    .set("Cookie", "auth_token=" + userTwo.tokens[0].token)
    .attach("pic", "test/fixtures/profile-pic.jpg")
    .expect(400);
});
test("Should delete a picture for a room", async () => {
  var a = await Room.findOne({ _id: roomOne._id });

  const bu = fs.readFileSync(path.join(__dirname, "/fixtures/profile-pic.jpg"));

  a.pics.push({
    _id: roomeOnePicID,
    pic: bu,
  });
  console.log(roomeOnePicID);

  a.pics.push({
    pic: bu,
  });

  await a.save();

  const response = await request(app)
    .delete("/rooms/" + roomOne.name + "/pic/admin/")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send([roomeOnePicID])
    .expect(200);

  const roooms = await Room.find({});

  console.log(roooms);

  const room = await Room.findOne({ _id: roomOne._id });

  console.log("alpha " + room);
});
