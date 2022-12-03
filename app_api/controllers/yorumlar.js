var mongoose = require("mongoose");
var Mekan = mongoose.model("mekan");

const cevapOlustur = (res, status, content) => {
    res.status(status).json(content);
};

const sonPuanHesapla = (mekan) => {
    let yorumSayisi, ortalamaPuan, toplamPuan;
    const { yorumlar } = mekan;
    if (yorumlar && yorumlar.length > 0) {
        yorumSayisi = yorumlar.length;
        toplamPuan = yorumlar.reduce((total, yorum) => {
            return total + yorum.puan;
        }, 0);
        ortalamaPuan = parseInt(toplamPuan / yorumSayisi, 10);
        mekan.puan = ortalamaPuan;
        mekan.save((hata) => {
            if (hata) {
                console.log(hata);
            }
        });
    }
};

const ortalamaGuncelle = ({ _id }) => {
    Mekan.findById(_id)
        .select("puan yorumlar")
        .exec((hata, mekan) => {
            if (!hata) {
                sonPuanHesapla(mekan);
            }
        });
};

const yorumOlustur = (req, res, mekan) => {
    if (!mekan) {
        cevapOlustur(res, 404, { hata: "Mekan bulunamadi" });
    } else {
        const { yorumYapan, puan, yorumMetni } = req.body;
        const { yorumlar } = mekan;
        mekan.yorumlar.push({
            yorumYapan,
            puan,
            yorumMetni,
            tarih: Date.now(),
        });
        mekan.save((hata) => {
            var yorum;
            if (hata) {
                cevapOlustur(res, 400, hata);
            } else {
                ortalamaGuncelle(mekan);
                yorum = [...yorumlar].pop();
                cevapOlustur(res, 201, yorum);
            }
        });
    }
};

const yorumlariListele = (req, res) => {};

const yorumEkle = (req, res) => {
    const { mekanid } = req.params;
    if (mekanid) {
        Mekan.findById(mekanid)
            .select("yorumlar")
            .exec((hata, mekan) => {
                if (hata) {
                    res.status(400).json(hata);
                } else {
                    yorumOlustur(req, res, mekan);
                }
            });
    } else {
        cevapOlustur(res, 404, { mesaj: "mekan bulunmadi" });
    }
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
    const { mekanid, yorumid } = req.params;
    if (!mekanid || !yorumid) {
        cevapOlustur(res, 404, { mesaj: "mekaid ve yorumid gerekli" });
        return;
    }
    Mekan.findById(mekanid)
        .select("yorumlar")
        .exec((hata, mekan) => {
            if (hata) {
                cevapOlustur(res, 404, hata);
            } else if (!mekan) {
                cevapOlustur(res, 404, { mesaj: "mekan bulunamadi" });
            } else {
                const { yorumlar } = mekan;
                if (yorumlar && yorumlar.length > 0) {
                    let yorum = yorumlar.id(yorumid);
                    if (!yorum) {
                        cevapOlustur(res, 404, { mesaj: "yorum bulunamadi" });
                        return;
                    }
                    const { puan, yorumMetni, yorumYapan } = req.body;
                    yorum.puan = puan;
                    yorum.yorumMetni = yorumMetni;
                    yorum.yorumYapan = yorumYapan;
                    mekan.save((hata, mekan) => {
                        if (hata) {
                            cevapOlustur(res, 404, hata);
                        } else {
                            ortalamaGuncelle(mekan);
                            cevapOlustur(res, 200, yorum);
                        }
                    });
                } else {
                    cevapOlustur(res, 404, { mesaj: "Guncellenicek yorum yok" });
                }
            }
        });
};

const yorumSil = (req, res) => {
    const { mekanid, yorumid } = req.params;
    if (!mekanid || !yorumid) {
        cevapOlustur(res, 404, { mesak: "Bulunamadi. mekanid ve yorumid gerekli" });
        return;
    }
    Mekan.findById(mekanid)
        .select("yorumlar")
        .exec((hata, mekan) => {
            console.log(mekan);
            if (!mekan) {
                cevapOlustur(res, 404, { mesaj: "mekanid bulunmadi" });
                return;
            } else if (hata) {
                cevapOlustur(res, 404, hata);
                return;
            }
            const { yorumlar } = mekan;
            console.log(yorumlar);
            if (yorumlar && yorumlar.length > 0) {
                if (!yorumlar.id(yorumid)) {
                    cevapOlustur(res, 404, { masaj: "yorum bulunamadi" });
                } else {
                    yorumlar.id(yorumid).remove();
                    mekan.save((hata, mekan) => {
                        if (hata) {
                            cevapOlustur(res, 404, hata);
                        } else {
                            ortalamaGuncelle(mekan);
                            cevapOlustur(res, 200, { drum: "yorum silindi" });
                        }
                    });
                }
            } else {
                cevapOlustur(res, 404, { mesaj: "Silinicek yorum yok" });
            }
        });
};

module.exports = {
    yorumSil,
    yorumGuncelle,
    yorumEkle,
    yorumlariListele,
    yorumGetir,
};