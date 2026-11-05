const asyncHandler = require("../utils/asyncHandler")
const User = require("../models/User")
const CustomError = require("../utils/CustomError")
const fs = require("fs/promises")
const path = require("path")

const getMyProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        msg: "User data retreived succesfully",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            address: req.user.address,
            dob: req.user.dob,
            profileImage: req.user.profileImage,
            role: req.user.role
        }
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, address, dob } = req.body;
    const updates = {}

    // Save the current image path before updating
    const oldProfileImage = req.user.profileImage;

    if (name !== undefined) {
        updates.name = name.trim();
    }
    if (email !== undefined) {
        updates.email = email.trim().toLowerCase();
    }
    if (phone !== undefined) {
        updates.phone = phone?.trim() || null;
    }
    if (address !== undefined) {
        updates.address = address.trim();
    }
    if (dob !== undefined) {
        updates.dob = dob || null;
    }

    if (req.file) {
        updates.profileImage = `/uploads/${req.file.filename}`
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        {
            new: true,
            runValidators: true
        }
    ).select("-password")

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    // Delete the old image only after the database update succeeds
    if (req.file && oldProfileImage?.startsWith("/uploads/")) {
        const oldFilename = path.basename(oldProfileImage);
        const oldFilePath = path.join(
            __dirname,
            "..",
            "uploads",
            oldFilename
        );

        try {
            await fs.unlink(oldFilePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error(
                    "Failed to delete old profile image:",
                    error
                );
            }
        }
    }


    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });

})

module.exports = { getMyProfile, updateUser }