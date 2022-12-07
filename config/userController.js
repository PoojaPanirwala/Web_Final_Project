const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

async function register(data) {

    // Our register logic starts here
    try {
        // Get user input
        const { firstname, lastname, email, password } = data;

        // Validate user input
        if (!(email && password && firstname && lastname)) {
            return "All input is required";
        }

        // check if user already exist
        // Validate if user exist in our database
        // const alluser = User.find();
        const oldUser = await User.findOne({ email: email });
        console.log(oldUser);

        if (oldUser) {
            return "User Already Exist. Please Login";
        }
        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        return user;
    } catch (err) {
        console.log("error ", JSON.stringify(err))
        return err;
    }
}

module.exports = {
    register
};