const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
const { User } = require("../../../src/models/user.model");
const { UserService } = require("../../../src/services/user.service");
const { StoryService } = require("../../../src/services/story.service");

describe("test Delete/ story", () => {
    let idStory, token1, token2, idUser1, idUser2;
    beforeEach("Create a story for test", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        await UserService.signUp("tranthanhlichit@gmail.com", "123");
        const user1 = await UserService.signIn("caovinhkhait@gmail.com", "123");
        const user2 = await UserService.signIn("tranthanhlichit@gmail.com", "123");

        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id;
        idUser2 = user2._id;
        const story = new Story({ content: "hahaha", author: user1._id });
        await story.save();
        idStory = story._id;
    });
    it("Can delete a story", async() => {

        var response = await request(app)
            .delete(`/story/remove/${idStory}`)
            .set({ token: token1 });

        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, "hahaha");
        equal(story._id, idStory);
        equal(story.author.toString(), idUser1);
        const deleteStory = await Story.findOne({});
        equal(deleteStory, null);

        const user1 = await User.findById(idUser1);
        const checkExist = user1.stories.some(id => id == story._id);
        equal(checkExist, false);
    });

    it("Cannot delete a story with invalid id", async() => {
        var response = await request(app)
            .delete(`/story/remove/${idStory}112232`)
            .set({ token: token1 });
        const { success, story } = response.body;
        equal(success, false);
        equal(story, undefined);
        const deleteStory = await Story.findOne({});
        equal(deleteStory.content, "hahaha");
    });

    it("Cannot delete a removed story", async() => {
        await StoryService.delete(idStory, idUser1);

        var response = await request(app)
            .delete(`/story/remove/${idStory}`)
            .set({ token: token1 });

        const { success, message, story } = response.body;

        equal(success, false);
        equal(story, undefined);
        equal(response.status, 404);
        equal(message, "CANNOT_FIND_STORY");
        const deleteStory = await Story.findOne({});
        equal(deleteStory, null);

    });

    it("Cannot delete a story without token", async() => {
        var response = await request(app)
            .delete(`/story/remove/${idStory}`);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, "INVALID_TOKEN");
        const deleteStory = await Story.findOne({});
        equal(deleteStory.content, "hahaha");
    });

    it("Cannot delete a story with token2", async() => {
        var response = await request(app)
            .delete(`/story/remove/${idStory}`)
            .set({ token: token2 });

        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, "CANNOT_FIND_STORY");
        equal(response.status, 404);
        const deleteStory = await Story.findOne({});
        equal(deleteStory.content, "hahaha");
    });
});