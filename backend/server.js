const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoutes")
const ProfileRoute = require("./routes/profileRoutes")
const errorMiddleware = require("./middleware/errorMiddleware")

const path = require("path")

// const protect = require("./middleware/authMiddleware")



dotenv.config()
// console.log("Mongo URI exists:", !!process.env.MONGO_URI);
// console.log("Mongo URI:", process.env.MONGO_URI);

const app = express()

//MIddleware
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoute)
app.use("/api/profile", ProfileRoute)

// Temporary Protected Route
// app.get("/api/test-protected", protect, (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Authentication successful",
//         user: {
//             id: req.user._id,
//             name: req.user.name,
//             email: req.user.email,
//             role: req.user.role
//         }
//     });
// });

//Test Route
app.get("/", (req,res) =>{
    res.send("Hi I am Live")
})



// Global Error Handler - Handles all API errors
app.use(errorMiddleware)

//Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, ()=>{
            console.log(`Server running on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Failed to Start Server : ${error.message}`);
        process.exit(1)
    }
}

startServer()