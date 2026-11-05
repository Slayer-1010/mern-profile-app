const express = require("express")
const router = express.Router()

const protected = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")
const{getMyProfile, updateUser} = require("../controller/profileController")
const {updateProfileValidation} = require("../middleware/profileValidation")
const validateImageContent = require("../middleware/validateImageContent")

router.get("/me", protected, getMyProfile);

router.patch("/me", protected, upload.single("profileImage"), validateImageContent, updateProfileValidation, updateUser);

module.exports = router;