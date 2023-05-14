var mongoose = require("mongoose");
var Mekan = mongoose.model("mekan");

cevrimler = (() => {
    var dunyaYariCapi = 6371;
    var radyan2Kilometre = (radyan) => parseFloat(radyan * dunyaYariCapi);
    var kilometre2Radyan = (mesafe) => parseFloat(mesafe / dunyaYariCapi);

    return {
        radyan2Kilometre,
        kilometre2Radyan,
    };
})();

const cevapOlustur = (res, status, content) => {
    res.status(status).json(content);
};

const mekanlariListele = async(req, res) => {
    var enlem = parseFloat(req.query.enlem);
    var boylam = parseFloat(req.query.boylam);
    var koordinat = {
        type: "Point",
        coordinates: [enlem, boylam],
    };
    var geoOptions = {
        distanceField: "mesafe",
        spherical: true,
    };
    if ((!enlem && boylam !== 0) || (enlem !== 0 && !boylam)) {
        cevapOlustur(res, 404, { hata: "Enlem ve Boylem orunlu parametreler" });
        return;
    }
    try {
        const sonuc = await Mekan.aggregate([{
            $geoNear: {
                near: koordinat,
                ...geoOptions,
            },
        }, ]);
        const mekanlar = sonuc.map((mekan) => {
            const { ad, adres, puan, imkanlar, _id, mesafe } = mekan;
            return {
                mesafe: cevrimler.kilometre2Radyan(mesafe),
                ad,
                adres,
                puan,
                imkanlar,
                _id,
            };
        });
        cevapOlustur(res, 200, mekanlar);
    } catch (error) {
        cevapOlustur(res, 404, error);
    }
};

const mekanEkle = (req, res) => {
    const { ad, adres, imkanlar, enlem, boylam } = req.body;
    Mekan.create({
            ad,
            adres,
            imkanlar: imkanlar.split(","),
            koordinat: [parseFloat(enlem), parseFloat(boylam)],
            saatler: [{
                    gunler: req.body.gunler1,
                    acilis: req.body.acilis1,
                    kapanis: req.body.kapanis1,
                    kapali: req.body.kapali1,
                },
                {
                    gunler: req.body.gunler2,
                    acilis: req.body.acilis2,
                    kapanis: req.body.kapanis2,
                    kapali: req.body.kapali2,
                },
            ],
        },
        (hata, mekan) => {
            if (hata) {
                cevapOlustur(res, 400, hata);
            } else {
                cevapOlustur(res, 201, mekan);
            }
        }
    );
};
const mekanGetir = (req, res) => {
    const { mekanid } = req.params;
    if (req.params && mekanid) {
        Mekan.findById(mekanid).exec((error, mekan) => {
            console.log(mekan);
            if (!mekan) {
                cevapOlustur(res, 404, { hata: "Boyle bir mekan yok" });
            } else if (error) {
                cevapOlustur(res, 404, { hata: error });
            } else {
                cevapOlustur(res, 200, mekan);
            }
        });
    } else {
        cevapOlustur(res, 404, { hata: "Istekde boyle bir mekanid yok" });
    }
};
const mekanGuncelle = (req, res) => {
    const { mekanid } = req.params;
    if (req.params && mekanid) {
        Mekan.findById(mekanid)
            .select("-puan -yorumlar")
            .exec((hata, mekan) => {
                const { ad, adres, enlem, boylam } = req.body;
                mekan.ad = ad;
                mekan.adres = adres;
                mekan.imkanlar = req.body.imkanlar.split(",");
                mekan.koordinat = [parseFloat(enlem), parseFloat(boylam)];
                mekan.saatler = [{
                        gunler: req.body.gunler1,
                        acilis: req.body.acilis1,
                        kapanis: req.body.kapanis1,
                        kapali: req.body.kapali1,
                    },
                    {
                        gunler: req.body.gunler2,
                        acilis: req.body.acilis2,
                        kapanis: req.body.kapanis2,
                        kapali: req.body.kapali2,
                    },
                ];
                console.log(mekan);
                mekan.save((hata, mekan) => {
                    if (hata) {
                        cevapOlustur(res, 400, hata);
                        return;
                    }
                    cevapOlustur(res, 200, mekan);
                });
            });
    } else {
        cevapOlustur(res, 404, { mesaj: "mekanid bulunamadi" });
    }
};

const mekanSil = (req, res) => {
    var mekanid = req.params.mekanid;
    if (mekanid) {
        Mekan.findByIdAndRemove(mekanid).exec((hata, mekan) => {
            if (hata) {
                cevapOlustur(res, 404, hata);
                return;
            } else if (mekan) {
                cevapOlustur(res, 200, {
                    durum: "Mekan Silindi!",
                    "Silinen Mekan": mekan.ad,
                });
            } else {
                cevapOlustur(res, 404, { mesaj: "mekan bulunamadi" });
            }
        });
    } else {
        cevapOlustur(res, 404, { mesaj: "mekanid bulunamadı" });
    }
};

module.exports = {
    mekanSil,
    mekanGuncelle,
    mekanEkle,
    mekanlariListele,
    mekanGetir,
};