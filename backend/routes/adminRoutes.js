const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles")
const { getDashboardStats , getRecentUsers, getAllUsers } = require("../controller/adminController")
//Temorary admin access test
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats)
router.get("/recent-users", protect, authorizeRoles("admin"), getRecentUsers)
router.get("/users", protect, authorizeRoles("admin"), getAllUsers)

module.exports = router;