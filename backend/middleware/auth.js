const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncError');
const jwt = require('jsonwebtoken')
const User = require('../models/user');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookie.cookies;

    if(!token) return next(new ErrorHandler("Please login to continue", 401));

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
console.log("user: ", user)
    req.user = await User.findById(user.id);


    next()
})