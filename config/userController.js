const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
async function register(data) {

    try {
        // Get user input
        const { firstname, lastname, email, password } = data;

        // Validate user input
        if (!(email && password && firstname && lastname)) {
            return "Sorry, Check Your 'Required' Details Again!";
        }

        // check if user already exist
        // Validate if user exist in our database
        // const alluser = User.find();
        const oldUser = await User.findOne({ email: email });

        if (oldUser) {
            return "User Already Exist. Please Login!";
        }
        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);
        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2h",
            }
        );
        // Create user in our database
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword
        });


        // save user token
        user.token = token;
        localStorage.setItem("token", token);
        // return new user
        return "success";
    } catch (err) {
        console.log("error ", JSON.stringify(err))
        return err;
    }
}

async function login(data) {
    try {
        // Get user input
        const { email, password } = data;

        // Validate user input
        if (!(email && password)) {
            return "Please Enter Your Credentials First!";
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
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
            sessionStorage.setItem("token", token);

            // user
            return "success";
        }
        return "Sorry, Check Your Credentials Again!";
    } catch (err) {
        console.log("error ", JSON.stringify(err))
        return err;
    }
}

module.exports = {
    register,
    login
};