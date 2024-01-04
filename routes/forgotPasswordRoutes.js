

const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");


const { forgotPassword, resetPassword } = require("../routeComponents/forgotPasswordComponent")


// to check email for forget password
router.post("/api/check_email", [
    check("email", "Please enter a valid email").isEmail().notEmpty()
], forgotPassword)


// to reset password
router.post("/api/reset_password", [
    check("email", "Please Enter Valid Email").isEmail().notEmpty(),
    check("password", "Please Enter Password").notEmpty(),
    check("otp", "Please Enter Valid OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], resetPassword)

module.exports = router;