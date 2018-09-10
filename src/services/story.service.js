const { Story } = require("../models/story.model.js");

class StoryService {
    static async getAll() {
        return Story.find({});
    }
    static async add(content) {
        const story = new Story({ content });
        const newStory = await story.save();
        return newStory;
    }
    static async update(id, content) {
        const story = await Story.findByIdAndUpdate(id, { content }, { new: true });

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