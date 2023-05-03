const express = require('express')
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();


//SIGNUP User
userRouter.post('/signup', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enetr a Valid Email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);

    //If the error array is not empty then the error is reflected
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        let user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "User with this email already exist" })
        }

        //If user is not there then the password is hashed.
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt)

        //Create User
        user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        })

        const userIdData = {
            user: { id: user.id }
        }

        const authentication = jwt.sign(userIdData, process.env.JWT_SECRET);
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: authentication,
        });


    } catch (error) {
        console.log(error.message);
        res.send(500).send("Internal server error");
    }

})

//LOGIN
userRouter.post('/signin', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please login with the correct credentials" })
        }

        //Compare password and login the user
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ error: "Please try to logi with correct credentails" })
        }

        const userIdData = {
            user: { id: user.id }
        }

        const authentication = jwt.sign(userIdData, process.env.JWT_SECRET);

        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: authentication,
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error")
    }

})


//By adding the return keyword before each response, the function will exit after the response is sent, so the code won't continue to execute and try to send more than one response.





module.exports = userRouter;