const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { User } = require("../../../src/models/user.model");
const { hash, compare } = require("bcrypt");

describe("test sign up", () => {

    it("Can sign up", async() => {
        const response = await request(app)
            .post("/user/signup")
            .send({ email: "caovinhkhait@gmail.com", password: "123" });

        const { success, user, message } = response.body;
        equal(success, true);
        equal(message, null);
        equal(user.email, "caovinhkhait@gmail.com");

        const userInDB = await User.findOne({});
        equal(userInDB.email, user.email);
    });

    it("Cannot sign up with email was existed", async() => {
        //tạo user tồn tại trước khi thực hiện test
        const newUser = new User({ email: "caovinhkhait@gmail.com", password: "123" });
        await newUser.save();

        const response = await request(app)
            .post("/user/signup")
            .send({ email: "caovinhkhait@gmail.com", password: "123" });

        const { success, message, user } = response.body;
        equal(success, false);
        equal(message, "EMAIL_EXISTED");
        equal(user, null);

        const userInDB = await User.findOne({});
        equal(userInDB.email, "caovinhkhait@gmail.com");
    });

    it("Cannot sign up without email", async() => {
        const response = await request(app)
            .post("/user/signup")
            .send({ email: "", password: "123" });

        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, "INVALID_USER_INFO");
        equal(user, null);

        const checkUserInDB = await User.find({ email: "" });
        equal(checkUserInDB.length, 0);

    });

    it("Cannot sign up without password", async() => {
        const response = await request(app)
            .post("/user/signup")
            .send({ email: "caovinhkhait@gmail.com", password: "" });

        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, "INVALID_PASSWORD");
        equal(user, null);

        const checkUserInDB = await User.find({ password: "" });
        equal(checkUserInDB.length, 0);
    });
});