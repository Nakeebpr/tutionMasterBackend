



const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");

const { sendEmailMessage, contactUs } = require("../routeComponents/contactComponent")

// to send otp for sending message
router.post("/api/send_email_message", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
], sendEmailMessage)


// to send the contact us data to server
router.post("/api/contactUs", [
    check("name", "Please enter a valid name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("subject", "Please enter a Subject").notEmpty(),
    check("message", "Please enter a message").notEmpty(),
    check("otp", "Please enter a OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], contactUs)

module.exports = router;