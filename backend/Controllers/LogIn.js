const User = require('../Models/UserSchema');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid Email"
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.json({
                success: false,
                message: "Incorrect Credentials"
            });
        }

        const data = {
            user: {
                id: user._id
            }
        };
        user = await User.findByIdAndUpdate(user._id, { lastLoginDate: Date.now() }, { new: true });
        const token = jwt.sign(data, SECRET_KEY);
        console.log(user);
        return res.json({
            success: true,
            message: "Successfully logged ",
            authToken: token
        });
    } catch (err) {
        console.log("An error occurred while logging in: " + err.message);
        return res.status(400).send(err);
    }
}

module.exports = login;
