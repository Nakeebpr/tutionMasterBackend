

const express = require("express")
const router = express.Router()

const { getPhotos, isEmailAvailable } = require("../routeComponents/generalComponents")

// to get the saved images from server
router.get("/api/getPhotos", getPhotos)
router.get("/api/checkEmail/:email", isEmailAvailable)

module.exports = router;
