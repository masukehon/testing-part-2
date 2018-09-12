const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
const { UserService } = require("../../../src/services/user.service");

describe.only("test update/ story", () => {
    let token1, idUser1, token2, idUser2, idStory;
    beforeEach("Create a story for test", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        await UserService.signUp("tranthanhlichit@gmail.com", "123");
        const user1 = await UserService.signIn("caovinhkhait@gmail.com", "123");
        const user2 = await UserService.signIn("tranthanhlichit@gmail.com", "123");
        const story = new Story({ content: "hahaha", author: user1._id });
        await story.save();
        idStory = story._id;
        token1 = user1.token;
        idUser1 = user1._id;
        token2 = user2.token;
        idUser2 = user2._id;
    });
    it.only("Can update a story", async() => {
        const response = await request(app)
            .put(`/story/update/${idStory}`)
            .set({ token: token1 })
            .send({ content: "hihihi" });
        // return console.log(response.body);
        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, "hihihi");
        const updateStory = await Story.findOne({});
        equal(updateStory.content, "hihihi");
    });

    it("Cannot update a story with invalid id", async() => {
        const response = await request(app)
            .put(`/story/update/${idStory}123`)
            .send({ content: "hihihi" });

        const { success, story } = response.body;
        equal(success, false);
        equal(story, null);
        const updateStory = await Story.findOne({});
        equal(updateStory.content, "hahaha");
    });

    it("Cannot update a removed story", async() => {

        await Story.findByIdAndRemove(idStory);

        const response = await request(app)
            .put(`/story/update/${idStory}`)
            .send({ content: "hihihi" });

        const { success, message, story } = response.body;
        equal(success, false);
        equal(message, "Cannot find story");
        equal(story, null);
    });
});