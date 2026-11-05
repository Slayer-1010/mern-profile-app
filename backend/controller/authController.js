const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");

//Generate JWT Token

// const GenerateToken = (userId) =>{
//     return jwt.sign(
//         {userId: userId},
//         process.env.JWT_SECRET,
//         {expiresIn : "1d"}
//     )
// }

//Register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, address, dob } = req.body;

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
        throw new CustomError("Email already exist", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    const userData = {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        address: address?.trim() || "",
        dob: dob || null,
    };
    // Only include phone if the user provides one
    if (phone?.trim()) {
        userData.phone = phone.trim();
    }
    try {
        user = await User.create(userData);
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(
                error.keyPattern || {}
            )[0];

            if (duplicateField === "email") {
                throw new CustomError(
                    "Email already exists",
                    409
                );
            }

            if (duplicateField === "phone") {
                throw new CustomError(
                    "Phone number already exists",
                    409
                );
            }

            throw new CustomError(
                "Duplicate value detected",
                409
            );
        }

        throw error;
    }
 
    res.status(201).json({
        success: true,
        message: "Register Successfull. Please log in.",
    })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalisedEmail = email.trim().toLowerCase()

    const user = await User.findOne({ email: normalisedEmail }).select("+password");

    if (!user) {
        throw new CustomError("Invalid email or Password", 401)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new CustomError("Invalid email or Password", 401)
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        success: true,
        msg: "Login Successful",    
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            dob: user.dob,
            profileImage: user.profileImage,
            role: user.role
        }
    })

})

module.exports = { registerUser, loginUser }