const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
const { User } = require("../../../src/models/user.model");
const { UserService } = require("../../../src/services/user.service");

describe("test POST/ story", () => {
    let token, userId;
    beforeEach("Sign up for test", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        const user = await UserService.signIn("caovinhkhait@gmail.com", "123");
        token = user.token;
        userId = user._id;
    });

    it("Can create new story", async() => {

        const response = await request(app)
            .post("/story")
            .set({ token })
            .send({ content: "abc" });
        const { success, storyInfo } = response.body;
        equal(success, true);
        equal(storyInfo.content, "abc");

        const storyInDB = await Story.findOne({}).populate("author"); //trả về thằng đầu tiên nó tìm thấy
        equal(storyInDB._id, storyInfo._id);
        equal(storyInDB.content, storyInfo.content);
        equal(storyInDB.author.email, "caovinhkhait@gmail.com");
        equal(storyInDB.author._id.toString(), userId);
        //storyInDB.author._id phải toString
        //vì bên model của story set nó là kiểu ObjectId

        const userInDB = await User.findOne({}).populate('stories');
        equal(userInDB.stories[0]._id.toString(), storyInDB._id);
        equal(userInDB.stories[0].content, "abc");

        // Story.findById(id)
        //     .then(story => {
        //         if (!story) throw new Error("Khong tim thay story");
        //         equal(story.content, "abc12");
        //     })
        //     .catch(error => { throw new Error("Loi"); });
        //nếu đã dùng async thì phải dùng await
        //nếu dùng như ở trên thì phải có done() và try catch
    });

    it("Cannot create new story with empty content", async() => {
        const response = await request(app)
            .post("/story")
            .set({ token })
            .send({ content: "" });
        const { success, storyInfo } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(storyInfo, undefined);
        const story = await Story.findOne({});
        equal(story, null);

    });
});