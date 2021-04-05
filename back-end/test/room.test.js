const request = require("supertest");
const app = require("../src/app");
const Room = require("../src/models/room");
const {
  userOneId,
  userOne,
  userTwo,
  roomOne,
  roomTwo,
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
test("Should get a room ", async () => {
  var response = await request(app)
    .get("/rooms/" + roomOne.name)
    .send()
    .expect(200);

  expect(response.body.name).toBe(roomOne.name);
});
test("Should not get a room ", async () => {
  var response = await request(app).get("/rooms/not a room").send().expect(400);

  expect(response.body.name).toBeUndefined();
});
test("Should get room with admin permissions", async () => {
  const response = await request(app)
    .get("/rooms/" + roomOne.name + "/admin")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send()
    .expect(200);

  expect(response.body.name).toBe(roomOne.name);
  expect(response.body.pic).not.toBeNull();
  expect(response.body.buckedlist).not.toBeNull();
  expect(response.body.props.operatingSystem).toBe("Linux");
});
test("Should not get a room", async () => {
  const response = await request(app)
    .get("/rooms/some rubisch witch is not a room/admin")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send()
    .expect(400);

  expect(response.body.error).toBe("Room not found");
});

test("Should update the mentioned room with only the walid params", async () => {
  const updates = {
    name: "neuer name",
    props: {
      operatingSystem: "Windows",
      Board: "gen 2",
      Usbstick: "alpa",
    },
    buckedlist: {
      laufwerk: true,
    },
    stupid: true,
  };

  const response = await request(app)
    .patch("/rooms/" + roomOne.name + "/admin")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({ ...updates })
    .expect(200);

  expect(response.body.name).toBe(updates.name);
  expect(response.body.props).toEqual(updates.props);
  expect(response.body.stupid).toBeUndefined();
  expect(response.body.buckedlist.laufwerk).toBe(true);

  const room = await Room.findById({ _id: roomOne._id });

  expect(room.name).toBe(updates.name);
  expect(room.props).toEqual(updates.props);
  expect(room.stupid).toBeUndefined();
  expect(room.buckedlist.laufwerk).toBe(true);
});

test("should upload a new picture for a room", async () => {
  const response = await request(app)
    .post("/rooms/" + roomOne.name + "/admin/pics")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({});
});
