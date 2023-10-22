// create token and send it to the cookies
const sendToken = (user, statusCode, res) => {
    console.log("user: ", user)
    const token = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
console.log("token: ", token, options)
    res.status(statusCode).cookie("token", token, options).json({
        success: true, user, token
    })
}

module.exports = sendToken;