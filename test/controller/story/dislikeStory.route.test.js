const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { User } = require("../../../src/models/user.model");
const { Story } = require("../../../src/models/story.model");
const { StoryService } = require("../../../src/services/story.service");
const { UserService } = require("../../../src/services/user.service");

describe("Test dislike story", () => {
    let token1, token2, idUser1, idUser2, idStory;
    beforeEach("Create user, story for test",
        async() => {
            await UserService.signUp("caovinhkhait@gmail.com", "123");
            const user1 = await UserService.signIn("caovinhkhait@gmail.com", "123");
            await UserService.signUp("masuke96@gmail.com", "123");
            const user2 = await UserService.signIn("masuke96@gmail.com", "123");

            const story = new Story({ content: "hahaha", author: user1._id, fans: [] });

            await story.save();
            idStory = story._id;
            token1 = user1.token;
            idUser1 = user1._id;
            token2 = user2.token;
            idUser2 = user2._id;

            await StoryService.like(idStory, idUser2);
        });
    it("Can dislike a story", async() => {

        const response = await request(app)
            .post("/story/dislike/" + idStory)
            .set({ token: token2 });

        // console.log(response.body);
        const { success, story, message } = response.body;

        equal(success, true);
        equal(message, null);
        equal(story._id, idStory);
        equal(story.content, "hahaha");

        const storyInDB = await Story.findById(idStory);
        equal(storyInDB.fans.length, 0);
    });

    it("Cannot dislike a story with invalid id", async() => {

        const response = await request(app)
            .post("/story/dislike/123")
            .set({ token: token2 });

        // console.log(response.body);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(message, "INVALID_ID");
        equal(story, null);
    });

    it("Cannot dislike a story without token", async() => {

        const response = await request(app)
            .post("/story/like/" + idStory);

        // console.log(response.body);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(message, "INVALID_TOKEN");
        equal(story, null);

        const storyInDB = await Story.findById(idStory);
        equal(storyInDB.fans.length, 1);
    });

    it("Cannot dislike a removed story", async() => {
        await StoryService.delete(idStory, idUser1);

        const response = await request(app)
            .post("/story/like/" + idStory)
            .set({ token: token2 });

        const { success, story, message } = response.body;
        equal(success, false);
        equal(message, "CANNOT_FIND_STORY");
        equal(story, null);
        equal(response.status, 404);

        const storyInDB = await Story.findOne({});
        equal(storyInDB, null);
    });

    it("Cannot dislike a story twice", async() => {
        await request(app)
            .post("/story/like/" + idStory)
            .set({ token: token2 });

        const response = await request(app)
            .post("/story/like/" + idStory)
            .set({ token: token2 });

        const { success, story, message } = response.body;
        equal(success, false);
        equal(message, "CANNOT_FIND_STORY");
        equal(story, null);
        equal(response.status, 404);
    });
});