const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { User } = require("../../../src/models/user.model");
const { UserService } = require("../../../src/services/user.service");

describe("Test GET /user/check", () => {
    let token, _id;
    beforeEach("Create a user for test", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        const user = await UserService.signIn("caovinhkhait@gmail.com", "123");
        token = user.token;
        _id = user._id;
    });

    it("Can login with token", async() => {
        const response = await request(app)
            .get("/user/check")
            .set({ token });

        const { email, password } = response.body.user;
        equal(email, "caovinhkhait@gmail.com");
        equal(password, null);
    });

    it("Cannot login without token", async() => {
        const response = await request(app)
            .get("/user/check")

        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, "INVALID_TOKEN");
    });

    it("Cannot login with empty token", async() => {
        const response = await request(app)
            .get("/user/check")
            .set({ token: "" });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, "INVALID_TOKEN");
    });

    it("Cannot login with removed user", async() => {
        await User.findByIdAndRemove(_id);

        const response = await request(app)
            .get("/user/check")
            .set({ token });

        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 404);
        equal(message, "CANNOT_FIND_USER");
    });
});