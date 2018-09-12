const { Router } = require("express");
const { verify } = require("../helpers/jwt");

const checkRouter = Router();

checkRouter.all("*", async(req, res, next) => {
    const token = req.headers.token;
    const user = await verify(token).catch(error => res.status(400).send(error => res.send({ success: false, message: "INVALID_TOKEN" })));
    if (!user)
        return res.redirect('/dangnhap'); //chưa có view này
    req.idUser = user._id;
    next();
});

module.exports = { checkRouter };