


const { check, validationResult } = require("express-validator");
const { sendEmail } = require("../helpers/sendEmail")
const { sendWhatsApp } = require("../helpers/sendWhatsApp")
const contactUsModel = require("../models/contactUsModel")

module.exports.sendEmailMessage = async (req, res) => {

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

        const { emailResponse, randomNumber } = await sendEmail(email)

        const isEmailAvailable = await contactUsModel.findOne({ email });
        if (isEmailAvailable) {

            const codeUpdate = await contactUsModel.findOneAndUpdate({ email }, { otp: randomNumber }, { new: true })

            // if (phoneNo) {
            //     const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
            // }


            if (codeUpdate) {

                return res.status(200).json({
                    "response_code": "200",
                    "message": "Email sent.",
                    "status": "Success"
                });
            }
        } else {
            const newMessage = new contactUsModel({
                email,
                otp: randomNumber,
                phoneNo
            })

            const newMessageSaved = await newMessage.save();

            // if (phoneNo) {
            //     const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
            // }

            return res.status(200).json({
                "response_code": "200",
                "message": "Email sent.",
                "status": "Success"
            });
        }

    } catch (error) {
        res.status(500).json({
            "response_code": "500",
            "message": "Something Went Wrong...",
            "status": "Failure"
        })
    }
}

module.exports.contactUs = async (req, res) => {
    const { name, email, subject, message, otp } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        let messageSent = await contactUsModel.findOne({ email, otp });
        if (!messageSent) {
            return res.status(401).json({
                "message": "Incorrect OTP",
                "status": "Failure",
            })
        }

        const data = {
            name: name,
            subject: subject,
            message: message,
        }

        messageSent = await contactUsModel.find({ email: email, otp: otp })

        const newArray = messageSent[0].message.push(message)
        const updatedDocument = await messageSent[0].save();

        if (messageSent) {
            return res.status(200).json({
                "message": "Message Sent Successfully",
                "status": "Success",
            })
        }
    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        })
    }
}