const express = require("express");
const { json } = require("body-parser");
const { storyRouter } = require("./controller/story.route");
const { userRouter } = require("./controller/user.route");
const { checkRouter } = require("./controller/mustBeUser.middleware");

const app = express();

app.use(json());
app.use((req, res, next) => {
    res.onError = function(error) {
        const body = { success: false, message: error.message };
        res.status(error.statusCode || 500).send(body);
        if (!error.statusCode)
            console.log(error);
    }
    next();
});
app.use("/story", storyRouter);
app.use("/user", userRouter);

module.exports = { app };