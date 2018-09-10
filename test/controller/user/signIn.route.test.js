const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { User } = require("../../../src/models/user.model");
const { hash, compare } = require("bcrypt");

describe("test sign in", () => {
    beforeEach("Create a story for test", async() => {
        const password = await hash("123", 8);
        const newUser = new User({ email: "caovinhkhait@gmail.com", password });
        await newUser.save();
    });
    it("Can sign in", async() => {

        var response = await request(app).post("/user/signin").send({ email: "caovinhkhait@gmail.com", password: "123" });
        const { success, user } = response.body;

        equal(success, true);
        equal(user.email, "caovinhkhait@gmail.com");

        const checkPass = await compare("123", user.password);
        equal(checkPass, true);

        const userInDB = await User.findOne({});
        equal(userInDB.email, user.email);
        equal(userInDB.password, user.password);
    });
    it("Cannot sign in with invalid email", async() => {
        var response = await request(app).post("/user/signin").send({ email: "kha123it@gmail.com", password: "123" });
        const { success, user, message } = response.body;
        equal(user, null);
        equal(success, false);
        equal(message, "Cannot find user");

    });

    it("Cannot sign in with invalid password", async() => {
        var response = await request(app).post("/user/signin").send({ email: "caovinhkhait@gmail.com", password: "12345" });
        const { success, user, message } = response.body;
        equal(user, null);
        equal(success, false);
        equal(message, "Invalid password");

    });

});