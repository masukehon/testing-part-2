const { Router } = require("express");
const { UserService } = require("../services/user.service");
const userRouter = Router();

userRouter.post("/signin", (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

userRouter.post("/signup", (req, res) => {
    const { email, password } = req.body;
    UserService.signUp(email, password)
        .then(user => res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { userRouter };