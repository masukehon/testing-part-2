const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");

describe("test POST/ story", () => {
    it("Can create new story", async() => {

        const response = await request(app)
            .post("/story")
            .send({ content: "abc" });
        const { success, storyInfo } = response.body;
        equal(success, true);

        // Story.findById(id)
        //     .then(story => {
        //         if (!story) throw new Error("Khong tim thay story");
        //         equal(story.content, "abc12");
        //     })
        //     .catch(error => { throw new Error("Loi"); });
        //nếu đã dùng async thì phải dùng await
        //nếu dùng như ở trên thì phải có done() và try catch


        const id = storyInfo._id;
        const story = await Story.findOne({}); //trả về thằng đầu tiên nó tìm thấy
        equal(story.content, "abc");
        equal(story._id, id);
    });

    it("Cannot create new story with empty content", async() => {
        const response = await request(app)
            .post("/story")
            .send({ content: "" });
        const { success, storyInfo } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(storyInfo, undefined);
        const story = await Story.findOne({});
        equal(story, null);

    });
});