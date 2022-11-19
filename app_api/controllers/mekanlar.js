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
        console.log(sonuc);

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
    cevapOlustur(res, 200, { durum: "basarili" });
};
const mekanGetir = (req, res) => {
    const { mekanid } = req.params;
    if (req.params && mekanid) {
        Mekan.findById(mekanid).exec((error, mekan) => {
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
    cevapOlustur(res, 200, { durum: "basarili" });
};

const mekanSil = (req, res) => {
    cevapOlustur(res, 200, { durum: "basarili" });
};

module.exports = {
    mekanSil,
    mekanGuncelle,
    mekanEkle,
    mekanlariListele,
    mekanGetir,
};