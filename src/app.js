const express = require("express");
const { json } = require("body-parser");
const { Story } = require("./models/story.model.js");
const { UserService } = require("./services/user.service");

const app = express();

app.use(json());
app.get("/story", (req, res) => {
    Story.find({})
        .then(stories => res.send({ success: true, stories }))
        .catch(error => console.log(error));
});

app.post("/story", (req, res) => {
    const { content } = req.body;
    const story = new Story({ content });
    story.save()
        .then(storyInfo => res.send({ success: true, storyInfo }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.put("/story/update/:id", (req, res) => {
    const { content } = req.body;

    Story.findByIdAndUpdate(req.params.id, { content }, { new: true })
        .then(story => {
            //nếu truyền đúng định dạng id nhưng ko tìm thấy story đó
            if (!story)
                throw new Error("Cannot find story");
            //res.send này không liên quan gì trong db
            //nên lúc test phải lấy dữ liệu từ db ra để so sánh lần nữa
            res.send({ success: true, story });
        })
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.delete("/story/remove/:id", (req, res) => {

    Story.findByIdAndRemove(req.params.id)
        .then(story => {
            if (!story)
                throw new Error("Cannot find story");
            res.send({ success: true, story });
        })
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

//user signin
app.post("/user/signin", (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.post("/user/signup", (req, res) => {
    const { email, password } = req.body;
    UserService.signUp(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});



module.exports = { app };