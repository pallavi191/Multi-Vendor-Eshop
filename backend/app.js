const express = require('express');
const app = express();
const ErrorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// app.use(fileupload({useTempFiles: true}));

// import routes
const user = require("./controllers/user")
app.use("/user", user);

app.get("/hello", (req, res) => {
    console.log("hello")
    res.send({ hello: "hello" })
})
// include config
if (process.env.NODE_ENV != "PRODUCTION") {
    require('dotenv').config({
        path: 'config/.env'
    })
}

//handle errors
app.use(ErrorHandler)
module.exports = app;