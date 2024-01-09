




const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: String
    },
    Role: {
        type: String
    },
}, {
    timeStamps: true
})

module.exports = mongoose.model("register", registerSchema)