const messageModel = require("../model/messageModel");
const Messages = require("../model/messageModel");
const bcrypt = require("bcrypt");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: "Message added successfully" });
        return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllMessages = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Eamil already used", status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username, email, password: hashedPassword
        });

        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};