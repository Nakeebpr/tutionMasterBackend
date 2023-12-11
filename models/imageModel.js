


const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imageTitle: {
        type: String,
        required: true
    },
    image: {
        path: String
    }
}, { timestamps: true })


module.exports = new mongoose.model("image", imageSchema)