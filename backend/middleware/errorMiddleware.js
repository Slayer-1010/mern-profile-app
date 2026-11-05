const multer = require("multer");
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack || err.message)

    // Handle Multer upload errors
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "Image must be 2 MB or smaller"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Image upload failed"
        });
    }

    const statusCode = err.statusCode || 500;


    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ?
            "Internal Server Error"
            : err.message || "Something went wrong"
    })
}

module.exports = errorMiddleware