


const express = require("express")
const router = express.Router()

const authUser = require("../middleWare/authUser");

const { upload } = require("../helpers/multer")

const { studentInfo, studentInformation, updateStudentInfo, uploadImageUser, updateImageUser } = require("../routeComponents/StudentComponents")




// to get student personal info 
router.get("/api/studentInfo", authUser, studentInfo)

// test api
router.get("/api/studentInformation/:id", studentInformation)

// to update the student data from user side
router.post("/api/updateStudentInfo", authUser, updateStudentInfo)

// to upload the student profile picture
router.post("/api/upload_image_user", authUser, upload.single("image"), uploadImageUser)

// to update the student profile picture
router.post("/api/updateProfilepicture", authUser, updateImageUser)


module.exports = router;