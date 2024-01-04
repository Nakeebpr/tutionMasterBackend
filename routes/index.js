

const express = require("express");
const router = express.Router();

const interactionRoutes = require("./interactionRoutes");
const bookSeatRoutes = require("./bookSeatRoutes");
const forgotPasswordRoutes = require("./forgotPasswordRoutes");
const contactRoutes = require("./contactRoutes");
const adminRoutes = require("./adminRoutes");
const generalRoutes = require("./generalRoutes");
const studentRoutes = require("./studentRoutes");

router.get("/api", (req, res) => {
    res.send("From router")
});


router.use("/", interactionRoutes);
router.use("/", bookSeatRoutes);
router.use("/", forgotPasswordRoutes);
router.use("/", contactRoutes);
router.use("/", adminRoutes);
router.use("/", generalRoutes);
router.use("/", studentRoutes);


module.exports = router;