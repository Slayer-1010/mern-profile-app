const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles")

//Temorary admin access test
router.get("/dashboard", protect, authorizeRoles("admin"), (req,res) => {
    res.status(200).json({
        success : true,
        message : "Admin access granted",
        admin : {
            id : req.user._id,
            name : req.user.name,
            email : req.user.email,
            role : req.user.role
        }
    })
})

module.exports = router;