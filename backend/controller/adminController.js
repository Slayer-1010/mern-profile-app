const User = require ("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError")

const getDashboardStats = asyncHandler(async (req,res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
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
        User.countDocuments({role : "user", createdAt : {$gte : thirtyDaysAgo}}),
    ])

    res.status(200).json({
        success : true,
        message: "Dashboard Statistic Retrieved Successfully",
        stats : {
        totalUsers,
        activeUsers,
        disabledUsers,
        totalAdmins,
        newRegistrations,
        }
    })
})

const getRecentUsers = asyncHandler(async (req,res) => {
    const recentUsers = await User.find()
    .select("name email role status createdAt")
    .sort({createdAt :-1})
    .limit(5)
    .lean()
    
    res.status(200).json({
        success: true,
        message : "Recent users retrieved successfully",
        users : recentUsers
    })
})

const getAllUsers = asyncHandler(async (req,res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page-1)*limit;

    const {search , role, status, sortBy = "createdAt", order = "desc" } = req.query;
    const allowedSortFields = ["name", "email", "createdAt"]
    if(!allowedSortFields.includes(sortBy)){
        throw new CustomError("Invalid sort fields", 400)
    }
    if(!["asc", "desc",].includes(order)){
        throw new CustomError("Invalid sort order", 400)
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = {[sortBy] : sortOrder}
    //Build Filters
    const filter = {}

    if(search?.trim()){
        const searchTerm = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            {name : { $regex: searchTerm, $options : "i" } },
            {email : { $regex: searchTerm, $options : "i" } }
        ]
    }

    if(role){
        if(!["user", "admin"].includes(role)){
            throw new CustomError("Invalid role filter", 400)
        }
        filter.role = role;
    }

    if(status){
        if(!["active", "disabled"].includes(status)){
            throw new CustomError("Invalid role filter", 400)
        }
        filter.status = status;
    }

    const [users, totalUsers] = await Promise.all([
        User.find(filter)
            .select("name email phone role status createdAt")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(filter)
    ])

    res.status(200).json({
        success :true,
        message : "User Retrieved Successfully",
        pagination : {
            currentPage : page,
            limit,
            totalUsers,
            totalPages : Math.ceil(totalUsers / limit)
        },
        filters : {
            search : search || "",
            role : role || "",
            status : status || ""
        },
        users
    })
})

module.exports = {getDashboardStats, getRecentUsers, getAllUsers}