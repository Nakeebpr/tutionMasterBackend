

const imageModel = require("../models/imageModel");
const loginModel = require("../models/loginModel");


module.exports.getPhotos = async (req, res) => {

    const { page, itemsPerPage } = req.query;
    const pageSize = itemsPerPage;

    try {
        const pageNumber = parseInt(page, 10) || 1;
        const skip = (pageNumber - 1) * pageSize;

        const photoData = await imageModel.find({}).skip(skip).limit(pageSize);

        const totalItems = (await imageModel.find({})).length
        const totalPagesCount = Math.ceil(totalItems / pageSize)

        if (!photoData) {

            return res.status(200).json({
                message: "No Data Available",
                status: "Failure",
            })
        }

        return res.status(200).json({
            message: photoData,
            status: "Success",
            totalPagesCount,
            itemsPerPage: pageSize
        })
    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }
}


module.exports.isEmailAvailable = async (req, res) => {

    const { email } = req.params;
    console.log(email)

    try {
        const emailAvailable = await loginModel.findOne({ email: email });

        console.log(emailAvailable)

        if (!emailAvailable) {

            return res.status(200).json({
                message: false,
                status: "Success",
            })
        } else {
            return res.status(200).json({
                message: true,
                status: "Success",
            })
        }

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong",
            "status": "Failure",
        });
    }
}