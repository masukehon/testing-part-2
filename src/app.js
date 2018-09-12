const express = require("express");
const { json } = require("body-parser");
const { storyRouter } = require("./controller/story.route");
const { userRouter } = require("./controller/user.route");
const { checkRouter } = require("./controller/mustBeUser.middleware");

const app = express();

app.use(json());
// app.use(checkRouter);
app.use("/story", storyRouter);
app.use("/user", userRouter);

module.exports = { app };