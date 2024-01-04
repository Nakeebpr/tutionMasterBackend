


const { check, validationResult } = require("express-validator");
const loginModel = require("../models/loginModel")
const jwt = require("jsonwebtoken")
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


}