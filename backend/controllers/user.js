const multer = require('multer');
const path = require('path');
const express = require('express');
const { upload } = require('../multer');
const User = require('../models/user');
const router = express.Router();
const jwt = require("jsonwebtoken");
const ErrorHandler = require('../utils/ErrorHandler');
const sendMail = require('../utils/sendMail');
const catchAsyncError = require('../middleware/catchAsyncError')
const sendToken = require('../utils/jwtToken')
const fs = require('fs');
const { isAuthenticated } = require('../middleware/auth');
//create new user
router.post('/create-user', upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log("boyd: ", req.body)
        //check for user already exists or not
        const userExists = await User.findOne({ email });
        if (userExists){
            const filename = req.file.filename;
            const filepath = `uploads/${filename}`;
            fs.unlink(filepath, (err) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({message:  "Error deleyeying file"});
                }
            })
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const user = {
            name,
            email,
            password,
            avatar: fileUrl
        }
        console.log("user: ", user)

        // send mail to activate user
        const activationToken = await createUserActivation(user);
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;
        try {
            console.log("email:", email)
            await sendMail({
                to: email,
                subject: 'Activate your shopping account',
                message: `Hello ${name}, please click on a link to activate your account: ${activationUrl}`
            })
        } catch (error) {
            console.log("error: ", error)
            return next(new ErrorHandler(error.message, 500));
        }
        res.status(200).send({
            success: true,
            message: `please check your email: ${email}, to activate your account`
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

const createUserActivation = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "1d"
    })
}

router.post('/activation', catchAsyncError(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        console.log("newUser: ", req.body.activation_token)
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        console.log("newUser1: ", newUser)

        if (!newUser) {
            return next(new ErrorHandler("Invalid Token", 400));
        }

        const { name, email, password, avatar } = newUser;
        let userExists = await User.findOne({email})
        if(userExists) return next(new ErrorHandler("User already Exists", 400));

        const user = await User.create({
            name, email, password, avatar
        })

        sendToken(user, 201, res)

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// login user
router.post('/login', catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        if(!email || !password) return next(new ErrorHandler("Please provide all the fields", 400));

        const user = await User.findOne({ email }).select("+password");
        if(!user) return next(new ErrorHandler("User does not exists", 400));

        const isPassword = await user.comparePassword(password);
        if(!isPassword) return next(new ErrorHandler("Please Provide valid information", 400));

        sendToken(user, 201, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// load user
router.get('/getUser', isAuthenticated,  catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("user: ", user)

        if (!user) {
          return next(new ErrorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
          success: true,
          user,
        });  
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))
module.exports = router