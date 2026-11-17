const User = require ("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req,res) => {
    const thirtDaysAgo = new Date();
    thirtDaysAgo.setDate(thirtDaysAgo.getDate() - 30);
    const [
        totalUsers,
        activeUsers,
        disabledUsers,
        totalAdmins,
        newRegistrations,
    ] = await Promise.all([
        User.countDocuments({role : "user"}),
        User.countDocuments({role : "user", status : "active"}),
        User.countDocuments({role : "user", status : "disabled"}),
        User.countDocuments({role : "admin"}),
        User.countDocuments({role : "user", createdAt : {$gte : thirtDaysAgo}}),
    ])

    res.status(200).json({
        success : true,
        message: "DashboardStatistic Retrieved Successfully",
        stats : {
            totalUsers,
        activeUsers,
        disabledUsers,
        totalAdmins,
        newRegistrations,
        }
    })
})
module.exports = {getDashboardStats}