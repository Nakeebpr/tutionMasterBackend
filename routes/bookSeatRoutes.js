
const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");
const { sendEmailBookSeat, bookSeat } = require("../routeComponents/bookSeatComponent")


// initiate the booking
router.post("/api/send_email", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
], sendEmailBookSeat)

// to save the booking details 
router.post("/api/book_seat", [
    check("name", "Please enter a valid name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("classRoom", "Please enter a classRoom").notEmpty(),
    check("otp", "Please enter a OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], bookSeat)



module.exports = router;