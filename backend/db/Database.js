const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_URL,  {
        // useNewUrlParse: true,
        useUnifiedTopology: true
    }).then((data) => {
        console.log(`Database connection is done with host ${data.connection.host}`)
    })
}

module.exports = connectDB;