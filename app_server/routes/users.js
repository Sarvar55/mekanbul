var express = require("express");
var router = express.Router();
const verify = require("../auth/checkAuth");
const authController = require("../controllers/authController");
/* GET users listing. */

router.get("/login", authController.loginPage);
router.get("/signup", authController.signUpPage);

router.post("/login", authController.login);
router.post("/signup", authController.signUp);
router.get("/kullanici", authController.getUserDeatils);

router.get("/cikisyap", authController.logout);

module.exports = router;