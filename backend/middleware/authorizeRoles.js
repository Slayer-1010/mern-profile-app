const CustomError = require("../utils/CustomError");

const authorizeRoles = (...allowedRoles) => {
    return(req, res, next) => {
        if(!req.user){
            throw new CustomError("Not authorized. Please log in.", 401)
        }
        if(!allowedRoles.includes(req.user.role)){
            throw new CustomError("You dont have permission to access this resource.", 403)
        }
        next();
    }
}

module.exports = authorizeRoles