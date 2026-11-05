const fs = require("fs/promises");
const path = require("path");
const CustomError = require("../utils/CustomError");


const allowedTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"]
};

const validateImageContent = async (req, res, next) => {
    // Text-only profile updates are allowed.
    if (!req.file) {
        return next();
    }
    try {
        // file-type is ESM, so use dynamic import from our CommonJS middleware.
        const {fileTypeFromFile} = await import("file-type")
        
        const detected = await fileTypeFromFile(req.file.path);

        const originalExtension = path
        .extname(req.file.originalname)
        .toLowerCase();

        const valid = 
            detected &&
            allowedTypes[detected.mime] &&
            allowedTypes[detected.mime].includes(originalExtension);
        
            if(!valid){
                await fs.unlink(req.file.path).catch(()=>{})

                return next(
                    new CustomError("Invalid image content or file extension. Upload a genuine JPG, PNG, or WEBP image.",
                    400)
                )
            }
            return next();
    } catch (error) {
        // Remove the uploaded file if inspection itself fails.
        await fs.unlink(req.file.path).catch(() => {});

        return next(error)
    }
}

module.exports = validateImageContent;
