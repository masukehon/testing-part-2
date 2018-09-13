const request = require("supertest");
const { equal } = require("assert");
const { app } = require("../../../src/app");
const { Story } = require("../../../src/models/story.model");
const { User } = require("../../../src/models/user.model");
const { Comment } = require("../../../src/models/comment.model");
const { UserService } = require("../../../src/services/user.service");
const { StoryService } = require("../../../src/services/story.service");
const { CommentService } = require("../../../src/services/comment.service");

describe.only("test Update Comment", () => {
    let token1, idUser1, idStory, idComment;
    beforeEach("Update story,comment, 2 user to test comment", async() => {
        await UserService.signUp("caovinhkhait@gmail.com", "123");
        const user1 = await UserService.signIn("caovinhkhait@gmail.com", "123");
        await UserService.signUp("masuke96@gmail.com", "123");
        const user2 = await UserService.signIn("masuke96@gmail.com", "123");

        const story = await StoryService.add(user1._id, "hahaha");
        const comment = await CommentService.create(story._id, user2._id, "Cau chuyen hay vc");

        idStory = story._id;
        token1 = user1.token;
        idUser1 = user1._id;
        token2 = user2.token;
        idUser2 = user2._id;
        idComment = comment._id;
    });

    it("Can update comment", async() => {
        const response = await request(app)
            .put("/comment/update/" + idComment)
            .set({ token: token2 })
            .send({ content: "Cau chuyen rat hay" });

        const { comment, success, message } = response.body;

        equal(success, true);
        equal(comment.content, "Cau chuyen rat hay");
        equal(message, null);

        const commentInDB = await Comment.findById(idComment);
        equal(comment.content, commentInDB.content);
        equal(comment._id, commentInDB._id);
    });

    it("Cannot update comment with empty content", async() => {

        const response = await request(app)
            .put("/comment/update/" + idComment)
            .set({ token: token2 })
            .send({ content: "" });

        const { comment, success, message } = response.body;

        equal(success, false);
        equal(comment, null);
        equal(message, "CONTENT_MUST_BE_PROVIDED");

        const commentInDB = await Comment.findById(idComment);
        equal("Cau chuyen hay vc", commentInDB.content);

    });

    it("Cannot udpate comment with invalid idComment", async() => {

        const response = await request(app)
            .put("/comment/update/1233")
            .set({ token: token2 })
            .send({ content: "Cau chuyen rat hay" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_ID");
        const commentInDB = await Comment.findById(idComment);
        equal("Cau chuyen hay vc", commentInDB.content);

    });

    it("Cannot update comment without token", async() => {

        const response = await request(app)
            .put("/comment/update/1233")
            .send({ content: "Cau chuyen rat hay" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_TOKEN");
        const commentInDB = await Comment.findById(idComment);
        equal("Cau chuyen hay vc", commentInDB.content);
    });

    it("Cannot update comment with invalid token", async() => {
        const response = await request(app)
            .post("/comment/create")
            .set({ token: "ldsakjffdj" })
            .send({ idStory, content: "Cau chuyen rat hay" });

        const { success, comment, message } = response.body;
        // return console.log(response.body);
        equal(response.status, 400);
        equal(success, false);
        equal(comment, undefined);
        equal(message, "INVALID_TOKEN");
        const commentInDB = await Comment.findOne({});
        equal("Cau chuyen hay vc", commentInDB.content);
    });
});