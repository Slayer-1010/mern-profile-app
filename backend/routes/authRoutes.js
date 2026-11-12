const express= require("express")
const router = express.Router()
const {registerUser, loginUser, logoutUser} = require("../controller/authController")
const {userValidation, loginValidation} = require("../middleware/userValidation")


router.post("/register", userValidation ,registerUser)
router.post("/login", loginValidation ,loginUser)
router.post("/logout", logoutUser)


module.exports = router