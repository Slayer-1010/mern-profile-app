const jwt = require("jsonwebtoken")
const User = require("../models/User")
const CustomError = require("../utils/CustomError")

const protect = async(req, res, next) => {

    //Read token from HTTPonly cookie 
    const token = req.cookies?.token


    if(!token){
        throw new CustomError("Not Authorized. No token provided.", 401)
    }

    //Verify the JWT
    let decoded;
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
        throw new CustomError("Invalid or expired token", 401)
    }

    //Find the authenticate user     
    const user = await User.findById(decoded.userId)

    if (!user) {
        throw new CustomError("User no longer exists.", 401);
    }

    // Make the authenticated user available to the protected route
    req.user = user

    next();
}

module.exports = protect;

//here we read token from auth header
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")
// const CustomError = require("../utils/CustomError")

// const protect = async(req, res, next) => {
//     let token;

//     //Read token from Authorization Header
//     if(
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer ")
//     ){
//         token = req.headers.authorization.split(" ")[1];
//     }

//     if(!token){
//         throw new CustomError("Not Authorized. No token provided.", 401)
//     }

//     //Verify the token
//     let decoded;
//     try {
//         decoded = jwt.verify(token,process.env.JWT_SECRET);
//     } catch (error) {
//         throw new CustomError("Invalid or expired token", 401)
//     }

//     //Find the user and exclude there password..in schema already false     
//     const user = await User.findById(decoded.userId)

//     if (!user) {
//         throw new CustomError("User no longer exists.", 401);
//     }

//     // Make the authenticated user available to the route
//     req.user = user

//     next();
// }

// module.exports = protect;

// alternate
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const asyncHandler = require("../utils/asyncHandler"); not required for exp5
// const CustomError = require("../utils/CustomError");

// const protect = asyncHandler(async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         throw new CustomError("Authentication required", 401);
//     }

//     const token = authHeader.split(" ")[1];

//     let decoded;
//     try {
//          decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//         throw new CustomError("Invalid or expired token", 401)
//     }

//     const user = await User.findById(decoded.userId);

//     if (!user) {
//         throw new CustomError("User no longer exists", 401);
//     }

//     req.user = user;

//     next();
// });

// module.exports = protect;