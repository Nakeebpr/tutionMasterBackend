

const { check, validationResult } = require("express-validator");
const bookSeatModel = require("../models/bookSeat")
const { sendEmail } = require("../helpers/sendEmail")


module.exports.sendEmailBookSeat = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    try {

        const { email, phoneNo } = req.body;

        console.log(email, phoneNo)

        let user = await bookSeatModel.findOne({ email });
        if (user) {
            return res.status(500).json({
                "message": "User Already Exists",
                "status": "Failure",
            })
        }

        console.log(user)


        // code for email if i send email using helper start
        const { emailResponse, randomNumber } = await sendEmail(email)


        // comment whatsapp things for now

        // if (phoneNo) {
        //     const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
        // }

        // Handle the response or error here
        res.status(200).json({
            "response_code": "200",
            "message": "Email sent.",
            "status": "Success"
        });

        // code for email if i send email using helper end


        user = new bookSeatModel({
            email,
            otp: randomNumber,
            phoneNo
        });

        const userSaved = await user.save();

    } catch (error) {
        res.status(500).json({
            "response_code": "500",
            "message": "Something Went Wrong...",
            "status": "Failure"
        })
    }


}


module.exports.bookSeat = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    const { name, email, classRoom, otp } = req.body;

    let user = await bookSeatModel.findOne({ email, otp });
    if (!user) {
        return res.status(401).json({
            "message": "Incorrect OTP",
            "status": "Failure",
        })
    }

    const data = {
        name: name,
        classRoom: classRoom
    }


    user = await bookSeatModel.findOneAndUpdate({ email: email }, data, { new: true })

    if (user) {
        return res.status(200).json({
            "message": "Request Sent Successfully",
            "status": "Success",
        })
    }
}