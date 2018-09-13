const mongoose = require("mongoose");

const { Schema } = mongoose;
//không thể destructoring biến model ở đây
//vì trong hàm model có this
//nếu destructoring thì các hàm của nó sẽ ko hiểu

const userSchema = new Schema({
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    incommingRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]

});

const User = mongoose.model('User', userSchema);

module.exports = { User };