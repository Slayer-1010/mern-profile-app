const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles")
const {adminUpdateUserValidation} = require("../middleware/adminValidation")
const { getDashboardStats , getRecentUsers, getAllUsers , getUserDetails, updateUserByAdmin, updateUserStatus} = require("../controller/adminController")
//Temorary admin access test
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats)
router.get("/recent-users", protect, authorizeRoles("admin"), getRecentUsers)
router.get("/users", protect, authorizeRoles("admin"), getAllUsers)
router.get("/users/:id", protect, authorizeRoles("admin"), getUserDetails)
router.patch("/users/:id", protect, authorizeRoles("admin"), adminUpdateUserValidation , updateUserByAdmin)
router.patch("/users/:id/status", protect, authorizeRoles("admin"), updateUserStatus)

module.exports = router;