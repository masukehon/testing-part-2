const { User } = require("../models/user.model");
const { hash, compare } = require("bcrypt");
const { verify, sign } = require("../helpers/jwt");
const { MyError } = require("../models/my-error.model");

class UserService {

    static async signUp(email, plainPassword) {
        if (!plainPassword)
            throw new MyError("INVALID_PASSWORD", 400);
        const password = await hash(plainPassword, 8);
        try {

            const user = User({ email, password, stories: [] });
            await user.save();
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        } catch (error) {
            if (error.name === "ValidationError")
                throw new MyError("INVALID_USER_INFO", 400);
            throw new MyError("EMAIL_EXISTED", 400);
        }
    }

    static async signIn(email, plainPassword) {
        const user = await User.findOne({ email });
        if (!user) throw new MyError("CANNOT_FIND_USER", 404);
        const same = await compare(plainPassword, user.password);
        if (!same) throw new MyError("INVALID_USER_INFO", 400);
        const token = await sign(user);
        user.token = token;
        return user;
    }

    static async check(id) {
        const user = await User.findById(id);
        if (!user) throw new MyError('CANNOT_FIND_USER', 404);
        const userInfo = user.toObject();
        delete userInfo.password;
        userInfo.token = await sign({ _id: user._id });
        return userInfo;
    }
}

module.exports = { UserService };