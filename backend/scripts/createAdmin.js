require("dotenv").config();

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error("Please provide ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in your .env file.")
        }
        if (password.length < 8) {
            throw new Error("Admin password must contain atleast 8 character.")
        }

        const existingAdmin = await User.findOne({ email })
        if (existingAdmin) {
            if (existingAdmin.role === "admin") {
                console.log("An admin account with this email already exists.");
                return;
            }
            throw new Error("This email already belongs to a regular user. Choose another admin email.");
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin account created successfully");
    } catch (error) {
        console.error("Admin creation failed.", error.message);
    }
    finally{
        await mongoose.disconnect()
    }
}

createAdmin();