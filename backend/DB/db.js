const mongoose = require('mongoose');
require('dotenv').config()
const url = process.env.MONGO_URL
async function connectToDatabse() {
    try {
        await mongoose.connect(url).then(() => {
            console.log("Successfully Connected to Database")
        })
    } catch (e) {
        console.log("Error connecting to Database")
        console.log(e);
    }
}

module.exports = connectToDatabse

