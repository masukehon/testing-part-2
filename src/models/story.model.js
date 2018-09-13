const mongoose = require("mongoose");

const { Schema } = mongoose;
//không thể destructoring biến model ở đây
//vì trong hàm model có this
//nếu destructoring thì các hàm của nó sẽ ko hiểu

const storySchema = new Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };