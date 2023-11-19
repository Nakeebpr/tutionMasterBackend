

const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    message: {
        type: [String],
        require: true
    },
    phoneNo: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("contactUsModel", contactUsSchema)