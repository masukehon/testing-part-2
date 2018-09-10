const { User } = require("../models/user.model");
const { hash, compare } = require("bcrypt");

class UserService {
    static async signUp() {

    }
    static async signIn(email, plainPassword) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Cannot find user");
        const same = await compare(plainPassword, user.password);
        if (!same) throw new Error("Invalid password");
        return user;

    }
}

module.exports = { UserService };