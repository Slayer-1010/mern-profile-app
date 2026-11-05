const multer = require("multer")
const path = require("path")
const crypto = require("crypto")

const uploadDir = path.join(__dirname, "..", "uploads");    

const storage = multer.diskStorage({
    destination: uploadDir,

    filename: (req, file, cb) => {
        const extension = path
        .extname(file.originalname)
        .toLowerCase();

        cb(null, `${crypto.randomUUID()}${extension}`)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true)
    }
    
    const error = new Error(
        "Only JPG, PNG, and WEBP images are allowed"
    );
    error.statusCode = 400;

    return cb(error);
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
})

module.exports = upload;