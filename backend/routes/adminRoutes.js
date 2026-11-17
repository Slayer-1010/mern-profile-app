const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles")
const { getDashboardStats } = require("../controller/adminController")
//Temorary admin access test
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats
)

module.exports = router;