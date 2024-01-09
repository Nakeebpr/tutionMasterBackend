


const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");


const { loginInteraction, registerInteraction, sendEmailRegister } = require("../routeComponents/interactionComponent")


// to login
router.post("/api/login", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("password", "Please enter a OTP").notEmpty(),
], loginInteraction)

// to send email register
router.post("/api/send_email_register", [
    check("name", "Please enter a name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("password", "Please enter a OTP").notEmpty(),
], sendEmailRegister)

// to register
router.post("/api/register", [
    check("name", "Please enter a name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("password", "Please enter a OTP").notEmpty(),
], registerInteraction)

module.exports = router;