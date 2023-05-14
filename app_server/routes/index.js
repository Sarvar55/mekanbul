var express = require("express");
var router = express.Router();
var ctrlMekanlar = require("../controllers/mekanlar");
var ctrlDigerleri = require("../controllers/digerleri");
const verify = require("../auth/checkAuth");
const authController = require("../controllers/authController");
/* GET home page. */
router.get("/", ctrlMekanlar.anaSayfa);

router.get("/mekan/:mekanid", ctrlMekanlar.mekanBilgisi);
router.get(
    "/mekan/:mekanid/yorum/yeni",
    verify.authenticateToken,
    ctrlMekanlar.yorumEkle
);
router.post(
    "/mekan/:mekanid/yorum/yeni",
    verify.authenticateToken,
    ctrlMekanlar.yorummumuEkle
);
router.get("/hakkinda", verify.authenticateToken, ctrlDigerleri.hakkinda);

router.get("/adminpage", verify.authenticateToken, authController.adminSayfasi);
router.get("/mekanguncelle/:mekanid", ctrlMekanlar.mekanGuncelleSayfasi);
router.post("/mekanguncelle/:mekanid", ctrlMekanlar.mekanGuncelle);
router.get("/mekanekle", ctrlMekanlar.mekanEkleSayfasi);
router.post("/mekanekle", ctrlMekanlar.yeniMekanEkle);
router.get("/mekansil/:mekanid", ctrlMekanlar.mekanSil);
router.get("/kullanici", authController.getUserDeatils);
router.get("/cikisyap", authController.logout);

module.exports = router;