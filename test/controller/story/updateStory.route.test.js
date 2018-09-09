const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");

describe.only("test update/ story", () => {
    let idStory;
    beforeEach("Create a story for test", async() => {
        const story = new Story({ content: "hahaha" });
        await story.save();
        idStory = story._id;
    });
    it("Can update a story", async() => {
        const response = await request(app)
            .put(`/story/update/${idStory}`)
            .send({ content: "hihihi" });

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

    it.only("Cannot update a removed story", async() => {

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