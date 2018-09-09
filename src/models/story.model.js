const mongoose = require("mongoose");

const { Schema } = mongoose;
//không thể destructoring biến model ở đây
//vì trong hàm model có this
//nếu destructoring thì các hàm của nó sẽ ko hiểu

const storySchema = new Schema({
    content: { type: String, required: true, trim: true }
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };