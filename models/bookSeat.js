const mongoose = require("mongoose")

const seatSchema = new mongoose.Schema({
    name: {
        require: true,
        type: String
    },
    email: {
        require: true,
        type: String
    },
    classRoom: {
        require: true,
        type: String
    },
    phoneNo: {
        require: true,
        type: String
    },
    otp: {
        require: true,
        type: Number
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("bookSeat", seatSchema)