const { User } = require("../models/user.model");
const { hash, compare } = require("bcrypt");

class UserService {

    static async signUp(email, plainPassword) {
        if (email === "")
            throw new Error("Invalid email");
        if (plainPassword === "")
            throw new Error("Invalid password");

        const user = await User.findOne({ email });
        if (user) throw new Error("Email was existed");

        let password = await hash(plainPassword, 8);
        password = password.toString();
        let newUser = User({ email, password });
        newUser = await newUser.save();
        if (!newUser) throw new Error("Error not define");
        return newUser;
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