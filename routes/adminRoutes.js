





const express = require("express");
const router = express.Router();

const auth = require("../middleWare/auth");
const { upload } = require("../helpers/multer");

const { studentList, uploadImage, saveImage, deleteImage, updateStudent, deleteStudent } = require("../routeComponents/adminComponents");



// to get student list
router.get("/api/studentData", auth, studentList);

// to delete student record from server
router.post("/api/deleteStudent", auth, deleteStudent);

// to update student data from admin side
router.post("/api/updateStudent", auth, updateStudent);

// to upload image on server
router.post("/api/upload_image", auth, upload.single("image"), uploadImage);

// to save image on server
router.post("/api/save_image", auth, saveImage);

// to delete images from server
router.post("/api/deleteImage", auth, deleteImage);

module.exports = router;