var express = require("express");
var router = express.Router();
const auth = require("../config/auth");
var crtlMekanlar = require("../controllers/mekanlar");
var crtlYorumlar = require("../controllers/yorumlar");
const ctrlAuth = require("../controllers/dogrulama");

router
    .route("/mekanlar/:mekanid")
    .get(crtlMekanlar.mekanGetir)
    .put(crtlMekanlar.mekanGuncelle)
    .delete(crtlMekanlar.mekanSil);

/**yarin app_server katmainnda calis neden cunki sen sayfa renderlemeyi orda yapiyorsun
 *
 * ordan kontrolu sagla
 */
router.post("/login", ctrlAuth.girisYap);
router.post("/signup", ctrlAuth.kayitOl);

router
    .route("/mekanlar")
    .post(crtlMekanlar.mekanEkle)
    .get(crtlMekanlar.mekanlariListele);

router
    .route("/mekanlar/:mekanid/yorumlar")
    .post(auth.auth, crtlYorumlar.yorumEkle);

router
    .route("/mekanlar/:mekanid/yorumlar/:yorumid")
    .get(crtlYorumlar.yorumGetir)
    .put(auth.auth, crtlYorumlar.yorumGuncelle)
    .delete(auth.auth, crtlYorumlar.yorumSil);

router.route("/kullanicigetir/:userId").get(ctrlAuth.kullaniciGetir);
// simdi ise routerimiz dis dunyaya aciyiruz
module.exports = router;