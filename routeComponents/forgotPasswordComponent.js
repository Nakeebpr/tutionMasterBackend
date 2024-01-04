


const { check, validationResult } = require("express-validator");
const loginModel = require("../models/loginModel")
const { sendEmail } = require("../helpers/sendEmail")

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }
    try {
        const user = await loginModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                "message": "User Not Found",
                "status": "Failure"
            })
        }

        const { emailResponse, randomNumber } = await sendEmail(email)

        let newOtp = await loginModel.findOneAndUpdate({ email }, { otp: randomNumber }, { new: true })

        const newOtpSaved = await newOtp.save();

        return res.status(200).json({
            "message": "OTP sent to the email",
            "status": "Success"
        })



    } catch (error) {
        res.status(500).json({
            "response_code": "500",
            "message": "Something Went Wrong...",
            "status": "Failure"
        })
    }
}


module.exports.resetPassword = async (req, res) => {

    try {
        const { email, otp, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                "message": errors.array()[0]?.msg,
                "status": "Failure",
            });
        }

        const user = await loginModel.findOne({ email, otp });
        if (!user) {
            return res.status(400).json({
                "message": "User Not Found",
                "status": "Failure",
            });
        }

        let newPassword = await loginModel.findOneAndUpdate({ email, otp }, { password: password }, { new: true });

        const newPasswordSaved = await newPassword.save();

        return res.status(200).json({
            "message": "Password Updated SuccessFully",
            "status": "Success",
        });


    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            status: "Failure"
        })
    }


}