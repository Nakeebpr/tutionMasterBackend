


const { check, validationResult } = require("express-validator");
const loginModel = require("../models/loginModel")
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helpers/sendEmail");
const jwtString = process.env.JWT_STRING


module.exports.loginInteraction = async (req, res) => {
    const { email, password } = req.body

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
        if (!user) {
            return res.status(404).json({
                "message": "Email Or Password Is Incorrect",
                "status": "Failure",
            })
        }

        const payload = {
            userInfo: {
                id: user.id,
                Role: user.Role
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
                    "Role": user.Role
                })
            }
        )




    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        })
    }


};

module.exports.sendEmailRegister = async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure"
        })
    }

    let user = await loginModel.findOne({ email: email });

    if (user) {
        return res.status(400).json({
            message: "User already registered...Please login to continue.",
            status: "Failure"
        })
    }

    const { emailResponse, randomNumber } = await sendEmail(email);

    res.status(200).json({
        "message": "Email sent.",
        "status": "Success"
    });

    let newUser = new loginModel({
        email,
        otp: randomNumber,
        Role: "User"
    })

    let userSaved = await newUser.save();


}

module.exports.registerInteraction = async (req, res) => {

    const { name, email, password, otp } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            "message": errors.array()[0]?.msg,
            "status": "Failure",
        });
    }

    try {
        let user = await loginModel.findOne({ email: email, otp: otp });

        if (!user) {
            return res.status(400).json({
                message: "User Not Available",
                status: "Failure"
            })
        }

        const data = {
            name,
            password
        }

        let updateUser = await loginModel.findOneAndUpdate({ email: email }, data, { new: true });

        if (updateUser) {
            const payload = {
                userInfo: {
                    id: user.id,
                    Role: user.Role
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
                        "message": "Register Successfull",
                        "status": "Success",
                        "token": token,
                        "Role": user.Role
                    })
                }
            )
        }


    } catch (error) {

    }
}