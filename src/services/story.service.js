const { Story } = require("../models/story.model.js");
const { User } = require("../models/user.model.js");

class StoryService {
    static async getAll() {
        return Story.find({});
    }
    static async add(idUser, content) {
        const story = new Story({ content, author: idUser });
        // let user = await User.findById(idUser);
        // user.stories.push(story._id);
        // await user.save();

        //thay vì viết 3 dòng comment trên thì chỉ viết 1 dòng dưới này
        await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        return story.save();
    }
    static async update(idUser, id, content) {

        const story = await Story.findOneAndUpdate({ _id: id, author: idUser }, { content }, { new: true });
        //nếu truyền đúng định dạng id nhưng ko tìm thấy story đó
        if (!story)
            throw new Error("Cannot find story");

        return story;
    }
    static async delete(id) {
        const story = await Story.findByIdAndRemove(id);
        if (!story)
            throw new Error("Cannot find story");

        return story;
    }
}

module.exports = { StoryService };