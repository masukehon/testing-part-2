const { Router } = require("express");
const { StoryService } = require("../services/story.service");
const storyRouter = Router();

storyRouter.get("/", (req, res) => {
    StoryService.getAll()
        .then(stories => res.send({ success: true, stories }))
        .catch(error => console.log(error));
});

storyRouter.post("/", (req, res) => {
    const { content } = req.body;
    StoryService.add(content)
        .then(storyInfo => res.send({ success: true, storyInfo }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

storyRouter.put("/update/:id", (req, res) => {
    const { content } = req.body;

    StoryService.update(req.params.id, content)
        .then(story => {
            //res.send này không liên quan gì trong db
            //nên lúc test phải lấy dữ liệu từ db ra để so sánh lần nữa
            res.send({ success: true, story });
        })
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

storyRouter.delete("/remove/:id", (req, res) => {

    StoryService.delete(req.params.id)
        .then(story => {
            res.send({ success: true, story });
        })
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { storyRouter };