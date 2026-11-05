// express 5 doesnot need asyncHandler a it automatically rejects error

const asyncHandler = (fn) =>{
    return async(req,res,next) =>{
        Promise.resolve(fn(req,res,next))
        .catch(next)
    }
}
module.exports = asyncHandler;
