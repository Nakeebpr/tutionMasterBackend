

const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
    },
    school: {
        type: String,
    },
    gender: {
        type: String,
    },
    classRoom: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    Role: {
        type: String,
        default: "User",
        require: true
    },
    otp: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("loginModel", loginSchema)