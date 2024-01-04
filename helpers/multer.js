


const multer = require("multer")

// multer config start
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.env.VERCEL_ENV === 'production' ? './public/uploads' : './src/uploads';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s+/g, '_'));
    }
});

module.exports.upload = multer({ storage: storage })
// multer config end