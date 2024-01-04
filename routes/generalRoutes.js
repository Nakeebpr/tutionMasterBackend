

const express = require("express")
const router = express.Router()

const { getPhotos } = require("../routeComponents/generalComponents")

// to get the saved images from server
router.get("/api/getPhotos", getPhotos)

module.exports = router;
