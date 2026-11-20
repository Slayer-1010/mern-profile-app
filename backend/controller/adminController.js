const User = require ("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

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
            throw new CustomError("Invalid status filter", 400)
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

const getUserDetails = asyncHandler(async (req,res) => {
    const { id } = req.params;
    //Validatae MongoDBId
    if(!mongoose.isValidObjectId(id)){
        throw new CustomError("Invalid User Id", 400);
    }
    const user = await User.findById(id).select("-password").lean();

    if(!user){
        throw new CustomError("User not found", 404)
    }

    res.status(200).json({
        success : true,
        message : "User detail retrieved successfully",
        user
    });
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, dob } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new CustomError("Invalid user ID", 400);
    }

    const updates = {};

    if (name !== undefined) updates.name = name.trim();

    if (email !== undefined) {
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: id }
        });

        if (existingUser) {
            throw new CustomError("Email already exists", 409);
        }

        updates.email = normalizedEmail;
    }

    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (address !== undefined) updates.address = address.trim();
    if (dob !== undefined) updates.dob = dob || null;

    if (Object.keys(updates).length === 0) {
        throw new CustomError("Please provide at least one field to update", 400);
    }

    let user;

    try {
        user = await User.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.email) {
            throw new CustomError("Email already exists", 409);
        }

        throw error;
    }

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user
    });
});

const updateUserStatus  = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const {status} = req.body;
     // Validate MongoDB ID
    if (!mongoose.isValidObjectId(id)) {
        throw new CustomError("Invalid user ID", 400);
    }

    // Validate status
    if (!["active", "disabled"].includes(status)) {
        throw new CustomError(
            "Status must be either active or disabled",
            400
        );
    }
    const user = await User.findById(id);

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    // Only regular user accounts can be managed
    if (user.role !== "user") {
        throw new CustomError(
            "Only regular user accounts can be activated or deactivated",
            403
        );
    }
    if (user.status === status) {
        throw new CustomError(`User is already ${status}`, 400);
    }
    user.status = status;
    await user.save();
    res.status(200).json({
        success: true,
        message: `User ${status === "active" ? "activated" : "deactivated"} successfully`,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }
    });

})

module.exports = {getDashboardStats, getRecentUsers, getAllUsers , getUserDetails, updateUserByAdmin, updateUserStatus}