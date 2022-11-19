var mongoose = require("mongoose");
const { head } = require("../routes");
var Mekan = mongoose.model("mekan");

const cevapOlustur = (res, status, content) => {
    res.status(status).json(content);
};

const yorumlariListele = (req, res) => {
    cevapOlustur(res, 200, { durum: "basarili" });
};
const yorumEkle = (req, res) => {
    cevapOlustur(res, 200, { durum: "basarili" });
};
const yorumGetir = (req, res) => {
    const { mekanid, yorumid } = req.params;
    if (req.params && mekanid && yorumid) {
        Mekan.findById(mekanid)
            .select("ad yorumlar")
            .exec((error, mekan) => {
                var yorum, cevap;
                if (!mekan) {
                    cevapOlustur(res, 404, { hata: "mekan bulunmadi" });
                    return;
                } else if (error) {
                    cevapOlustur(res, 404, { hata: error });
                    return;
                }
                const { yorumlar, ad } = mekan;
                if (yorumlar && yorumlar.length > 0) {
                    yorum = yorumlar.id(yorumid);
                    if (!yorum) {
                        cevapOlustur(res, 404, { hata: "Boyle bir yorum yok" });
                    } else {
                        cevap = {
                            mekan: {
                                id: mekanid,
                                ad,
                            },
                            yorum,
                        };
                        cevapOlustur(res, 200, cevap);
                    }
                } else {
                    cevapOlustur(res, 404, { hata: "Hic yorum yok" });
                }
            });
    } else {
        cevapOlustur(res, 404, {
            hata: "Bulunamadi. mekanid yorumid mutlaka girilmeli",
        });
    }
};
const yorumGuncelle = (req, res) => {
    cevapOlustur(res, 200, { durum: "basarili" });
};

const yorumSil = (req, res) => {
    cevapOlustur(res, 200, { durum: "basarili" });
};

module.exports = {
    yorumSil,
    yorumGuncelle,
    yorumEkle,
    yorumlariListele,
    yorumGetir,
};