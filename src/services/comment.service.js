const { Story } = require("../models/story.model.js");
const { User } = require("../models/user.model.js");
const { Comment } = require("../models/comment.model.js");
const { MyError } = require("../models/my-error.model.js");
const { checkObjectId } = require("../helpers/checkObjectId");

class CommentService {

    static async create(idStory, idUser, content) {
        checkObjectId(idStory, idUser);
        if (!content) throw new MyError("CONTENT_MUST_BE_PROVIDED", 400);

        const comment = new Comment({ content, author: idUser });
        const story = await Story.findByIdAndUpdate(idStory, { $push: { comments: comment._id } });
        if (!story)
            throw new MyError("CANNOT_FIND_STORY", 404);
        return comment.save();
    }
    static async update() {

    }
    static async delete() {

    }
    static async like() {

    }
    static async dislike() {

    }
}

module.exports = { CommentService };