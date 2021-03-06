const { Story } = require("../models/story.model.js");
const { User } = require("../models/user.model.js");
const { MyError } = require("../models/my-error.model.js");
const { checkObjectId } = require("../helpers/checkObjectId");

class StoryService {
    static async getAll() {
        return Story.find({});
    }
    static async add(idUser, content) {

        if (!content) throw new MyError("CONTENT_MUST_BE_PROVIDED", 400);
        const story = new Story({ content, author: idUser });
        // let user = await User.findById(idUser);
        // user.stories.push(story._id);
        // await user.save();

        //thay vì viết 3 dòng comment trên thì chỉ viết 1 dòng dưới này
        await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        return story.save();
    }
    static async update(idUser, id, content) {

        if (!content) throw new MyError("CONTENT_MUST_BE_PROVIDED", 400);
        checkObjectId(id);

        const story = await Story.findOneAndUpdate({ _id: id, author: idUser }, { content }, { new: true });
        //nếu truyền đúng định dạng id nhưng ko tìm thấy story đó
        if (!story) throw new MyError("CANNOT_FIND_STORY", 404);

        return story;
    }
    static async delete(id, idUser) {

        checkObjectId(id);
        const story = await Story.findOneAndRemove({ _id: id, author: idUser });
        await User.findByIdAndUpdate(idUser, { $pull: { stories: id } });

        if (!story)
            throw new MyError("CANNOT_FIND_STORY", 404);
        return story;
    }

    static async like(idStory, idUser) {
        checkObjectId(idStory, idUser);
        const query = { _id: idStory, fans: { $ne: idUser } };
        //$ne: not equal. là trong mảng fans ko đc có thằng nào bằng idUser nó mới tìm
        //nếu có rồi thì trả về null
        const story = await Story.findOneAndUpdate(query, { $addToSet: { fans: idUser } }, { new: true });
        if (!story)
            throw new MyError("CANNOT_FIND_STORY", 404);
        return story;
    }

    static async dislike(idStory, idUser) {
        checkObjectId(idStory, idUser);
        const query = { _id: idStory, fans: { $eq: idUser } };
        //$eq: equal. là trong mảng fans phải có thằng nào bằng idUser nó mới tìm
        const story = await Story.findOneAndUpdate(query, { $pull: { fans: idUser } }, { new: true });
        if (!story)
            throw new MyError("CANNOT_FIND_STORY", 404);
        return story;
    }
}

module.exports = { StoryService };