


const loginModel = require("../models/loginModel")

module.exports.studentInfo = async (req, res) => {
    try {

        console.log(req.user.id)
        const user = await loginModel.findById(req.user.id, { name: 1, email: 1, school: 1, gender: 1, password: 1, address: 1, phoneNo: 1, classRoom: 1, password: 1, imagePath: 1, registerNo: 1, _id: 0 })
        if (!user) {
            return res.status(200).json({
                "message": "Data Not Available",
                "status": "Success"
            })
        }

        return res.status(200).json({
            "data": user,
            "status": "Success"
        })
    } catch (error) {
        return res.status(500).json({
            "message": "Something Went Wrong",
            "status": "Failure"
        })
    }
}

module.exports.studentInformation = async (req, res) => {

    return res.status(200).json({
        "data": "user",
        "status": "Success"
    })

}

module.exports.updateStudentInfo = async (req, res) => {
    const { id, name, email, school, gender, password, address, phoneNo, classRoom } = req.body

    try {
        const user = await loginModel.findOne({ email: id });
        if (!user) {
            return res.status(200).json({
                "message": "No Data Available",
                "status": "Failure"
            })
        }

        const data = {
            name,
            email,
            school,
            gender,
            password,
            address,
            phoneNo,
            classRoom
        }

        const newData = await loginModel.findOneAndUpdate({ email: id }, data, { new: true });

        return res.status(200).json({
            message: "Record Updated Successfully",
            status: "Success"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            status: "Failure"
        })
    }
}

module.exports.uploadImageUser = async (req, res) => {

    try {
        const isAdmin = await loginModel.findOne({ _id: req.user.id })
        if (!isAdmin) {
            return res.status(408).json({
                message: "Not Authorized",
                status: "Failure",
            })
        }

        return res.status(200).json({
            "message": "Image uploaded",
            // "path": process.env.BASE_URL + req.file.filename, //for live
            "path": "http://localhost:5000/" + req.file.filename, //for local
            "status": "Success",
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }

}

module.exports.updateImageUser = async (req, res) => {
    const { id, imageUrl } = req.body

    try {
        const user = await loginModel.findOne({ email: id });
        if (!user) {
            return res.status(200).json({
                "message": "No Data Available",
                "status": "Failure"
            })
        }

        const data = {
            imagePath: imageUrl
        }

        const newData = await loginModel.findOneAndUpdate({ email: id }, data, { new: true });

        return res.status(200).json({
            message: "Record Updated Successfully",
            status: "Success"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            status: "Failure"
        })
    }
}