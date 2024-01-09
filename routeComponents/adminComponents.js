


const loginModel = require("../models/loginModel")
const bookSeatModel = require("../models/bookSeat")
const imageModel = require("../models/imageModel")

module.exports.studentList = async (req, res) => {

    const { name, email, phoneNo, className, page, itemsPerPage } = req.query;
    const pageSize = itemsPerPage;

    const filter = {};

    if (name) {
        filter.name = new RegExp(name, 'i');
    }
    if (email) {
        filter.email = new RegExp(email, 'i');
    }
    if (phoneNo) {
        filter.phoneNo = new RegExp(phoneNo, 'i');
    }
    if (className) {
        filter.classRoom = new RegExp(className, 'i');
    }

    const isAdmin = await loginModel.findOne({ _id: req.user.id })
    if (!isAdmin) {
        return res.status(408).json({
            message: "Not Authorized",
            status: "Failure",
        })
    }

    try {

        const pageNumber = parseInt(page, 10) || 1;
        const skip = (pageNumber - 1) * pageSize;

        const users = await bookSeatModel.find(filter, { name: 1, email: 1, phoneNo: 1, classRoom: 1, _id: 0 }).skip(skip).limit(pageSize)
        if (!users) {
            return res.status(200).json({
                "message": "No Data Available",
                "status": "Success"
            })
        }

        const totalItems = (await bookSeatModel.find({})).length

        const totalPagesCount = Math.ceil(totalItems / pageSize)


        return res.status(200).json({
            message: users,
            status: "Success",
            totalPagesCount,
            itemsPerPage: pageSize
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            status: "Failure"
        })
    }

}

module.exports.uploadImage = async (req, res) => {

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

module.exports.saveImage = async (req, res) => {

    try {
        const isAdmin = await loginModel.findOne({ _id: req.user.id })
        if (!isAdmin) {
            return res.status(408).json({
                message: "Not Authorized",
                status: "Failure",
            })
        }

        const { imageTitle, imagePath } = req.body;

        const data = new imageModel({
            imageTitle: imageTitle,
            image: {
                path: imagePath
            }
        })

        const imageSaved = await data.save();

        return res.status(200).json({
            "message": "Image uploaded successfully",
            "status": "Success",
        });
    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }

}

module.exports.deleteImage = async (req, res) => {

    const { id } = req.body;

    try {

        const imageData = await imageModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Item deleted successfully",
            status: "Success"
        })

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }

}


module.exports.updateStudent = async (req, res) => {
    const { id, name, email, phoneNo, classRoom } = req.body

    try {
        const user = await bookSeatModel.findOne({ email: id });
        if (!user) {
            return res.status(200).json({
                "message": "No Data Available",
                "status": "Failure"
            })
        }

        const data = {
            name,
            email,
            phoneNo,
            classRoom
        }
        const dataLogin = {
            name,
            email,
            phoneNo,
            classRoom
        }

        const newData = await bookSeatModel.findOneAndUpdate({ email: id }, data, { new: true });
        const newLoginData = await loginModel.findOneAndUpdate({ email: id }, dataLogin, { new: true });

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

module.exports.deleteStudent = async (req, res) => {

    const { email } = req.body;

    try {

        const studentData = await bookSeatModel.findOneAndDelete({ email: email });

        return res.status(200).json({
            message: "Item deleted successfully",
            status: "Success"
        })

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }

}