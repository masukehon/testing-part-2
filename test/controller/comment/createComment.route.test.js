const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
const { User } = require("../../../src/models/user.model");
const { Comment } = require("../../../src/models/comment.model");
const { UserService } = require("../../../src/services/user.service");
const { StoryService } = require("../../../src/services/story.service");

describe("test Create comment", () => {
    let token1, idUser1, idStory;
    beforeEach("Create user, story to test comment", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        const user1 = await UserService.signIn("caovinhkhait@gmail.com", "123");
        await UserService.signUp("masuke96@gmail.com", "123");
        const user2 = await UserService.signIn("masuke96@gmail.com", "123");

        const story = await StoryService.add(user1._id, "hahaha");

        idStory = story._id;
        token1 = user1.token;
        idUser1 = user1._id;
        token2 = user2.token;
        idUser2 = user2._id;
    });

    it("Can create new comment", async() => {

        const response = await request(app)
            .post("/comment/create")
            .set({ token: token2 })
            .send({ idStory, content: "Great story" });
        const { success, comment } = response.body;

        equal(success, true);
        equal(comment.content, "Great story");
        equal(comment.author, idUser2);

        const commentInDB = await Comment.findOne({}); //trả về thằng đầu tiên nó tìm thấy
        equal(commentInDB._id, comment._id);
        equal(commentInDB.content, comment.content);
        equal(commentInDB.author.toString(), idUser2);

        const userInDB = await User.findOne({}).populate('stories');
        equal(userInDB.stories[0]._id.toString(), idStory);
        equal(userInDB.stories[0].content, "hahaha");
        equal(userInDB.stories[0].author.toString(), idUser1);
    });

    it("Cannot create new comment with empty content", async() => {

        const response = await request(app)
            .post("/comment/create")
            .set({ token: token2 })
            .send({ idStory, content: "" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "CONTENT_MUST_BE_PROVIDED");
        const commentInDB = await Comment.findOne({});
        equal(commentInDB, null);

    });

    it("Cannot create new comment with invalid idStory", async() => {

        const response = await request(app)
            .post("/comment/create")
            .set({ token: token2 })
            .send({ idStory: "123", content: "Great story" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_ID");
        const commentInDB = await Comment.findOne({});
        equal(commentInDB, null);

    });

    it("Cannot create new comment without token", async() => {

        const response = await request(app)
            .post("/comment/create")
            .send({ idStory, content: "Great story" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_TOKEN");
        const commentInDB = await Comment.findOne({});
        equal(commentInDB, null);
    });

    it("Cannot create new comment with invalid token", async() => {
        const response = await request(app)
            .post("/comment/create")
            .set({ token: "ldsakjffdj" })
            .send({ idStory, content: "Great story" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_TOKEN");
        const commentInDB = await Comment.findOne({});
        equal(commentInDB, null);
    });
});