const asyncHandler = require("express-async-handler")
const validator = require("validator")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body


    if (validator.isEmpty(name)) {
        return res.status(400).json({ message: "Name Is Required" })
    }


    if (validator.isEmpty(email)) {
        return res.status(400).json({ message: "Email Is Required" })
    }


    if (validator.isEmpty(password)) {
        return res.status(400).json({ message: "Password Is Required" })
    }


    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please Provide Valid Email" })
    }


    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Please Provide strong password" })
    }

    const result = await User.findOne({ email })        //hai to object nhi hai to undefined

    if (result) {
        return res.status(400).json({ message: "Email Already Register with us" })
    }

    const x = await bcrypt.hash(password, 10)   //10 is salt for strong hash pass

    // await User.create({ ...req.body, active: true, role: "user", password: x })
    await User.create({ name, email, password: x })

    res.json({ message: "User register success" })
})



exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const result = await User.findOne({ email })

    if (!result) {
        return res.status(400).json({ message: "Email Do Not Match" })
    }

    //compare password

    const pass = await bcrypt.compare(password, result.password)

    if (!pass) {
        return res.status(400).json({ message: "Password Does Not Match" })
    }

    //Send Token

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY)
    //Send Cookie

    res.cookie("auth", token, { maxAge: 1000 * 60, httpOnly: true })    //valid for 1 minute//http use for cookie ko js me se access nhi karne dena hai

    res.json({
        message: "User login Success", result: {
            name: result.name,
            email: result.email,
            role: result.role
        }
    })
})


exports.logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("auth")

    res.json({ message: "User logout Success" })
})


exports.getAllUser = asyncHandler(async (req, res) => {

    const result = await User.find()

    res.json({ message: "User Fetch for admin Success", result })
})








