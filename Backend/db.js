const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;;

const connectToMongo = () => {
    mongoose.connect(mongoURL).then(() => {
        console.log("Connected to MongoDB")
    }).catch((e) => {
        console.log("Error: ", e)
    })

}

module.exports = connectToMongo;