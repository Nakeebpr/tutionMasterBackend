

const express = require("express")
const app = express()
const router = express.Router()
const { check, validationResult } = require("express-validator");
// var nodemailer = require("nodemailer")
const axios = require("axios")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer")

const { sendEmail } = require("../helpers/sendEmail")
const bookSeatModel = require("../models/bookSeat");
const contactUsModel = require("../models/contactUsModel");
const loginModel = require("../models/loginModel")
const { sendWhatsApp } = require("../helpers/sendWhatsApp");
const auth = require("../middleWare/auth");
const imageModel = require("../models/imageModel");



// const fromEmail = process.env.FROM_EMAIL
// const gmailPass = process.env.GMAIL_PASS
const twilioAcc = process.env.TWILIO_ACCOUNT_SID
const twilioAuth = process.env.TWILIO_AUTH_TOKEN
const jwtString = process.env.JWT_STRING

// multer config start
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s+/g, '_'))
    }
})

const upload = multer({ storage: storage })
// multer config end





router.get("/api", (req, res) => {
    res.send("From router")
})

router.post("/api/check_email", [
    check("email", "Please enter a valid email").isEmail().notEmpty()
], async (req, res) => {
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
        console.log(user)
        if (!user) {
            return res.status(404).json({
                "message": "User Not Found",
                "status": "Failure"
            })
        }

        const { emailResponse, randomNumber } = await sendEmail(email)

        console.log(randomNumber)

        let newOtp = await loginModel.findOneAndUpdate({ email }, { otp: randomNumber }, { new: true })
        console.log("newOtp")
        console.log(newOtp)

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
})


router.post("/api/book_seat", [
    check("name", "Please enter a valid name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("classRoom", "Please enter a classRoom").notEmpty(),
    check("otp", "Please enter a OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    const { name, email, classRoom, otp } = req.body;
    console.log(name)

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
            "message": "Student Registered Successfully",
            "status": "Success",
        })
    }


    // let mailTransporter = nodemailer.createTransport({
    //     ame: 'box5294',
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: fromEmail,
    //         pass: gmailPass
    //     }
    // })

    // let mailDetails = {
    //     from: fromEmail,
    //     to: email,
    //     subject: 'Hello its a test message',
    //     html: `<p>This is test email</p>`
    // };

    // mailTransporter.sendMail(mailDetails, function (err, data) {
    //     if (err) {
    //         console.log("mail detail: ", mailDetails);
    //         console.log("email error: ", err);
    //         // var data = err;
    //         // var method = "Error In OTP from mail Sent User Registration.log(User Registration / Email Verification API(log))";
    //         res.status(200).json({
    //             // message: error
    //             "response_code": "200",
    //             "message": err.message,
    //             "status": "Failure"
    //         })
    //     } else {
    //         console.log("Email sent");
    //         // var data = "Email Sent Success";
    //         // var method = "Success Email Sent User Registration.log(User Registration / Email Verification API(log))";
    //         res.status(200).json({
    //             "response_code": "200",
    //             "message": "Email sent",
    //             "status": "Success"
    //         })
    //     }
    // });


    // const min = 1000; // Smallest 4-digit number
    // const max = 9999; // Largest 4-digit number
    // const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;


    // user = new bookSeatModel({
    //     name,
    //     email,
    //     classRoom,
    //     otp: randomNumber
    // });

    // const userSaved = await user.save();
    // if (userSaved) {
    //     return res.status(200).json({
    //         "message": "User Saved Successfully",
    //         "status": "Success",
    //     })
    // }
    // console.log(user)
    // res.send(name)
})


router.post("/api/send_email", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
], async (req, res) => {

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
        console.log(email)

        let user = await bookSeatModel.findOne({ email });
        if (user) {
            return res.status(500).json({
                "message": "User Already Exists",
                "status": "Failure",
            })
        }


        // code for email if i send email using helper start
        const { emailResponse, randomNumber } = await sendEmail(email)
        console.log(emailResponse, randomNumber);

        if (phoneNo) {
            const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
            console.log("whatsAppMessage", whatsAppMessage)
        }

        // Handle the response or error here
        res.status(200).json({
            "response_code": "200",
            "message": "Email sent.",
            "status": "Success"
        });

        // code for email if i send email using helper end


        // code for email if i send email from this page only start

        // const min = 1000; // Smallest 4-digit number
        // const max = 9999; // Largest 4-digit number
        // const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;


        // let mailTransporter = nodemailer.createTransport({
        //     ame: 'box5294',
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: fromEmail,
        //         pass: gmailPass
        //     }
        // })

        // let mailDetails = {
        //     from: fromEmail,
        //     to: email,
        //     subject: 'OTP for the booking',
        //     html: `<p>Your otp is ${randomNumber}</p>`
        // };

        // mailTransporter.sendMail(mailDetails, function (err, data) {
        //     if (err) {
        //         console.log("mail detail: ", mailDetails);
        //         console.log("email error: ", err);
        //         // var data = err;
        //         // var method = "Error In OTP from mail Sent User Registration.log(User Registration / Email Verification API(log))";
        //         res.status(200).json({
        //             // message: error
        //             "response_code": "200",
        //             "message": err.message,
        //             "status": "Failure"
        //         })
        //     } else {
        //         console.log("Email sent");
        //         // var data = "Email Sent Success";
        //         // var method = "Success Email Sent User Registration.log(User Registration / Email Verification API(log))";
        //         res.status(200).json({
        //             "response_code": "200",
        //             "message": "Email sent.",
        //             "status": "Success"
        //         })
        //     }
        // });

        // code for email if i send email from this page only end


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


})


router.post("/api/send_email_message", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
], async (req, res) => {

    const errors = validationResult(req);
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    try {

        const { email, phoneNo } = req.body;
        console.log(email)

        const { emailResponse, randomNumber } = await sendEmail(email)
        console.log(emailResponse);

        const isEmailAvailable = await contactUsModel.findOne({ email });
        if (isEmailAvailable) {

            const codeUpdate = await contactUsModel.findOneAndUpdate({ email }, { otp: randomNumber }, { new: true })
            console.log("codeUpdate", codeUpdate)

            if (phoneNo) {
                const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
                console.log("whatsAppMessage", whatsAppMessage)
            }


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

            if (phoneNo) {
                const whatsAppMessage = await sendWhatsApp(randomNumber, phoneNo)
                console.log("whatsAppMessage", whatsAppMessage)
            }

            return res.status(200).json({
                "response_code": "200",
                "message": "Email sent.",
                "status": "Success"
            });
        }






        // let message = new contactUsModel({
        //     email,
        //     otp: randomNumber
        // })

        // const messageSaved = await message.save();

    } catch (error) {
        res.status(500).json({
            "response_code": "500",
            "message": "Something Went Wrong...",
            "status": "Failure"
        })
    }


})


router.get("/api/send_whatsapp", async (req, res) => {



    try {

        // const accountSid = twilioAcc;
        // const authToken = twilioAuth;
        // const client = require('twilio')(accountSid, authToken);

        // console.log(accountSid)
        // console.log(authToken)

        // send whatsapp message from here only start
        // client.messages
        //     .create({
        //         from: 'whatsapp:+14155238886',
        //         body: 'Hello, there, Sir Nakeeb! The code is 1234',
        //         to: 'whatsapp:+919503093882'
        //     })
        //     .then(message => console.log(message));

        // res.status(200).json({
        //     "response_code": "200",
        //     "message": "Message sent",
        //     "status": "Success"
        // })

        // send whatsapp message from here only end

        // send whatsapp using helper start

        // const whatsApp = await sendWhatsApp()
        // console.log("whatsApp")
        // console.log(whatsApp)

        // send whatsapp using helper end

    } catch (error) {
        res.status(500).json({
            "response_code": "5000",
            "message": "Something Went Wrong...",
            "status": "Failure"
        })
    }


    // wati.io

    // try {

    //     const url = 'https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=919503093882';
    //     const data = {
    //         broadcast_name: 'dsf',
    //         parameters: [{ name: 'name', value: '123' }],
    //         template_name: 'newthanks'
    //     };
    //     const headers = {
    //         'Content-Type': 'text/json',
    //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjEzNDRlNi01NGQ5LTQ4ZjktODc2Yy1mZjkxMTliMGY5ZGIiLCJ1bmlxdWVfbmFtZSI6InJhdXRuYWtlZWJAZ21haWwuY29tIiwibmFtZWlkIjoicmF1dG5ha2VlYkBnbWFpbC5jb20iLCJlbWFpbCI6InJhdXRuYWtlZWJAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMTEvMDIvMjAyMyAxODozNzo0MiIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRSSUFMIiwiZXhwIjoxNjk5NTc0NDAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.Bk89XenqNBhYfsRofi5fsUmcjA_akg3G_ttXEPPOjBU'
    //     };

    //     axios.post(url, data, { headers })
    //         .then(response => {
    //             console.log(response.data);
    //         })
    //         .catch(error => {
    //             console.error('error:', error);
    //         });



    // } catch (error) {
    //     res.status(200).json({
    //         "response_code": "200",
    //         "message": "Something Went Wrong...",
    //         "status": "Failure"
    //     })
    // }


})


router.post("/api/contactUs", [
    check("name", "Please enter a valid name").notEmpty(),
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("subject", "Please enter a Subject").notEmpty(),
    check("message", "Please enter a message").notEmpty(),
    check("otp", "Please enter a OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], async (req, res) => {
    const { name, email, subject, message, otp } = req.body
    console.log(name, email, subject, message, otp)

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
        console.log(error)
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        })
    }
})


router.post("/api/login", [
    check("email", "Please enter a valid email").isEmail().notEmpty(),
    check("password", "Please enter a OTP").notEmpty(),
], async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    try {

        let user = await loginModel.findOne({ email, password });

        console.log("user")
        console.log(user)
        if (!user) {
            return res.status(404).json({
                "message": "Email Or Password Is Incorrect",
                "status": "Failure",
            })
        }

        const payload = {
            userInfo: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            jwtString,
            {
                expiresIn: 3600,
            },
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                    "message": "Login Successfull",
                    "status": "Success",
                    "token": token,
                })
            }
        )




    } catch (error) {

        console.log(error)
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        })
    }


    // user = new loginModel({
    //     email,
    //     password
    // });

    // const userSaved = await user.save();


})

router.post("/api/reset_password", [
    check("email", "Please Enter Valid Email").isEmail().notEmpty(),
    check("password", "Please Enter Password").notEmpty(),
    check("otp", "Please Enter Valid OTP").notEmpty().isLength({ min: 4 }).isLength({ max: 4 }),
], async (req, res) => {

    try {
        const { email, otp, password } = req.body;
        console.log(email, otp, password)

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


})


router.get("/api/studentData", auth, async (req, res) => {

    console.log("req.user")
    console.log(req.user)

    const isAdmin = await loginModel.findOne({ _id: req.user.id })
    if (!isAdmin) {
        return res.status(408).json({
            message: "Not Authorized",
            status: "Failure",
        })
    }

    try {
        const users = await bookSeatModel.find({}, { name: 1, email: 1, phoneNo: 1, classRoom: 1, _id: 0 })
        if (!users) {
            return res.status(200).json({
                "message": "No Data Available",
                "status": "Success"
            })
        }


        return res.status(200).json({
            message: users,
            status: "Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something Went Wrong",
            status: "Failure"
        })
    }

})


router.post("/api/upload_image", auth, upload.single("image"), async (req, res) => {

    try {
        const isAdmin = await loginModel.findOne({ _id: req.user.id })
        if (!isAdmin) {
            return res.status(408).json({
                message: "Not Authorized",
                status: "Failure",
            })
        }

        const { imageTitle } = req.body;

        const data = new imageModel({
            imageTitle: imageTitle,
            image: "http://localhost:5000/" + req.file.filename
        })

        const imageSaved = await data.save();

        console.log("process.env.BASE_URL + req.file.filename")
        console.log(process.env.BASE_URL + req.file.filename)
        console.log("http://localhost:5000/" + req.file.filename)

        return res.status(200).json({
            "message": "Image uploaded",
            "status": "Success",
        });
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }



})


module.exports = router