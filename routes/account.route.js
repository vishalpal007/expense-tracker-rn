const router = require("express").Router();
const accountController = require("../controller/accountController");

router
    .post("/credit", accountController.credit)
    .post("/debit", accountController.debit);

module.exports = router