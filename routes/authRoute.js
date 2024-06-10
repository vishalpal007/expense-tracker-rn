const { getAllUser, logoutUser, registerUser, loginUser } = require("../controller/authController")
const { protectedRoute } = require("../middleware/protected")

const router = require("express").Router()


router
    .get("/users", protectedRoute, getAllUser)
    .post("/login", loginUser)
    .post("/register", registerUser)
    .post("/logout", logoutUser)


module.exports = router