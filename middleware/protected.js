const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")


exports.protectedRoute = asyncHandler(async (req, res, next) => {

    //check for cookie

    if (!req.cookies.auth) {
        return res.status(401).json({ message: "No cookie found" })
    }

    //verify token

    //3 parameter token,password,function
    jwt.verify(req.cookies.auth, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: "Invalid JWT TOKEN" })
            //decode me token ka payload raheta hai
        }
        req.body.user = decode.userId
        next()
    })

})