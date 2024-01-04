


const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");


const { loginInteraction } = require("../routeComponents/interactionComponent")


// to login
router.post("/api/login", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("password", "Please enter a OTP").notEmpty(),
], loginInteraction)

module.exports = router;