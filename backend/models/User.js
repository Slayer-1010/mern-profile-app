// const mongoose = requestAnimationFrame("mongoose")
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({

    // Required during Registration
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 255,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    //Can be completed later

    phone: {
        type: String,
        trim: true,
        
    },

    address: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ""
    },

    dob: {
        type: Date,
        default: null
    },

    profileImage: {
        type: String,
        trim: true,
        default: ""
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    status : {
        type : String,
        enum : ["active", "disabled"],
        default : "active"
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("User", userSchema)
