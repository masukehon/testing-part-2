const { Router } = require("express");
const { CommentService } = require("../services/comment.service");
const { mustBeUser } = require("./mustBeUser.middleware");

const commentRouter = Router();

commentRouter.use(mustBeUser);

commentRouter.post("/create", (req, res) => {
    const { content, idStory } = req.body;

    CommentService.create(idStory, req.idUser, content)
        .then(comment => res.send({ success: true, comment }))
        .catch(res.onError);
});

// commentRouter.put("/update/:id", (req, res) => {
//     const { content } = req.body;

//     CommentService.update(req.idUser, req.params.id, content)
//         .then(story => {
//             //res.send này không liên quan gì trong db
//             //nên lúc test phải lấy dữ liệu từ db ra để so sánh lần nữa
//             res.send({ success: true, story });
//         })
//         .catch(res.onError);
// });

// commentRouter.delete("/remove/:id", (req, res) => {

//     CommentService.delete(req.params.id, req.idUser)
//         .then(story => {
//             res.send({ success: true, story });
//         })
//         .catch(res.onError);
// });

// commentRouter.post("/like/:id", (req, res) => {
//     CommentService.like(req.params.id, req.idUser)
//         .then(story => res.send({ success: true, story }))
//         .catch(res.onError);
// });

// commentRouter.post("/dislike/:id", (req, res) => {
//     StoryService.dislike(req.params.id, req.idUser)
//         .then(story => res.send({ success: true, story }))
//         .catch(res.onError);
// });

module.exports = { commentRouter };