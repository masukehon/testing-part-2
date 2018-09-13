const { Router } = require("express");
const { UserService } = require("../services/user.service");
const { mustBeUser } = require("./mustBeUser.middleware");

const userRouter = Router();

userRouter.post("/signin", (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.post("/signup", (req, res) => {
    const { email, password } = req.body;
    UserService.signUp(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

userRouter.get("/check", mustBeUser, (req, res) => {
    UserService.check(req.idUser)
        .then(user => res.send({ success: true, user }))
        .catch(res.onError);
});

module.exports = { userRouter };