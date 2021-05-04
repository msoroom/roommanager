//.set('Cookie', ['myApp-token=12345667', 'myApp-other=blah'])
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should sign up a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Jonas",
      email: "l.jonahhhs@web.de",
      password: "Jayjay hat nen kleinen ",
    })
    .expect(201);
  //chesck if user exists
  const user = await User.findById({ _id: response.body.user._id });
  expect(user).not.toBeNull();

  //check if user is authstufe 1
  expect(user.perms).toEqual({
    see_pics: true,
    admin: false,
    see_props: false,
    edit_pics: false,
    edit_props: false,
    see_todo: false,
    edit_todo: false,
  });
});
test("Should not sign up a user", async () => {
  //user expist
  const response = await request(app)
    .post("/users")
    .send({
      name: "Jonas",
      email: "l.jonas@web.de",
      password: "Jayjay hat nen kleinen ",
    })
    .expect(401);

  // no password
  const response2 = await request(app)
    .post("/users")
    .send({
      name: "Jonas",
      email: "l.jonas@web.de",
    })
    .expect(401);

  // no email
  const response3 = await request(app)
    .post("/users")
    .send({
      name: "Jonas",

      password: "Jayjay hat nen kleinen ",
    })
    .expect(401);
});

test("Should sing in existing users", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not sing in existing users", async () => {
  //nothing provided
  await request(app).post("/users/login").send({}).expect(400);

  // wrong password
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "wrong password",
    })
    .expect(400);
  //wrong email
  await request(app)
    .post("/users/login")
    .send({
      email: "wrong email",
      password: userOne.password,
    })
    .expect(400);
});
test("Should log out user", async () => {
  const response = await request(app)
    .post("/users/logout")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send({})
    .expect(200);

  expect(response.body.user).toBeUndefined();
});

test("Should delete user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .expect(200);

  const user = await User.findById({ _id: userOneId });
  expect(user).toBeNull;
});

test("Should get the permissions of an user", async () => {
  const response = await request(app)
    .get("/users/me/auth")
    .set("Cookie", "auth_token=" + userOne.tokens[0].token)
    .send()
    .expect(200);

  expect(response.body).toEqual(userOne.perms);
});
