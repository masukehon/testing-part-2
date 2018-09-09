const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
describe("test Delete/ story", () => {
    let idStory;
    beforeEach("Create a story for test", async() => {
        const story = new Story({ content: "hahaha" });
        await story.save();
        idStory = story._id;
    });
    it("Can delete a story", async() => {

        var response = await request(app).delete(`/story/remove/${idStory}`);
        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, "hahaha");
        const deleteStory = await Story.findOne({});
        equal(deleteStory, null);
    });

    it("Cannot delete a story with invalid id", async() => {
        var response = await request(app).delete(`/story/remove/${idStory}112232`);
        const { success, story } = response.body;
        equal(success, false);
        equal(story, undefined);
        const deleteStory = await Story.findOne({});
        equal(deleteStory.content, "hahaha");
    });

    it("Cannot delete a removed story", async() => {
        await Story.findByIdAndRemove(idStory);

        var response = await request(app).delete(`/story/remove/${idStory}`);
        const { success, message, story } = response.body;

        equal(success, false);
        equal(story, undefined);
        equal(message, "Cannot find story");
        const deleteStory = await Story.findOne({});
        equal(deleteStory, null);

    });
});