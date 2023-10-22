const app = require('./app');
const connectDB = require('./db/Database')

//handle uncaught error
process.on('uncaughtException', (err) => {
    console.log("exception err: ", err.message)
    console.log("shutting down the server for handling uncaught exception")
})

//config
if(process.env.NODE_ENV != "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    })
}
//connect database
connectDB();

//initialize server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

//handle uncaught error
process.on('unhandledRejection', (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);
  
    server.close(() => {
        process.exit(1);
    })
  })