var express = require("express");
const axios = require("axios");

var apiSecenekleri = {
    sunucu: "http://localhost:3000",
    //sunucu: "https://mekanbul.servermusazade.repl.co",
    apiYolu: "/api/mekanlar/",
};

const mesafeyiFormatla = ({ mesafe }) => {
    var yeniMesafe, birim;
    if (mesafe > 1) {
        yeniMesafe = parseFloat(mesafe).toFixed(1);
        birim = " km";
    } else {
        yeniMesafe = parseInt(mesafe * 1000, 10);
        birim = " m";
    }
    return yeniMesafe.concat(birim);
};
const anaSayfaOlustur = (res, mekanListesi, path = "anasayfa") => {
    let mesaj;
    if (!(mekanListesi instanceof Array)) {
        mesaj = "API HATASI: Bir şeyler ters gitti.";
        mekanListesi = [];
    } else {
        if (!mekanListesi.length) {
            mesaj = "Civarda herhangi bir mekan yok";
        }
    }
    let baslik = "Anasayfa";
    if (new String(path).includes("adminpage")) {
        baslik = "Admin Sayfasi";
    }
    res.render(path, {
        baslik,
        sayfaBaslik: {
            siteAd: "MekanBul",
            slogan: "Civardaki Mekanları Keşfet!",
        },
        mekanlar: mekanListesi,
        mesaj,
    });
};

var detaySayfasiOlustur = (res, mekanDetaylari) => {
    mekanDetaylari.koordinat = {
        enlem: mekanDetaylari.koordinat[0],
        boylam: mekanDetaylari.koordinat[1],
    };
    res.render("mekanbilgisi", {
        mekanBaslik: mekanDetaylari.ad,
        mekanDetay: mekanDetaylari,
    });
};

const hataGoster = (res, hata) => {
    console.log(hata);
    let mesaj;
    if (!hata.response) mesaj = "401 ";
    else if (hata.response.status == 404) mesaj = "404, Sayfa Bulunamadı!";
    else mesaj = hata.response.status + " hatası";

    res.render("error", {
        mesaj,
    });
};

const anaSayfa = (req, res) => {
    const { sunucu, apiYolu } = apiSecenekleri;
    axios
        .get(sunucu.concat(apiYolu), {
            params: {
                enlem: req.query.enlem,
                boylam: req.query.boylam,
            },
        })
        .then((response) => {
            let mesafe, mekanlar;
            mekanlar = response.data.map((mekan) => {
                mesafe = mesafeyiFormatla(mekan);
                return {
                    ...mekan,
                    mesafe,
                };
            });
            anaSayfaOlustur(res, mekanlar);
        })
        .catch((hata) => {
            anaSayfaOlustur(res, hata);
        });
};

const mekanBilgisi = (req, res) => {
    const { sunucu, apiYolu } = apiSecenekleri;
    const { mekanid } = req.params;
    console.log("men burdda");
    axios
        .get(sunucu.concat(apiYolu) + mekanid)
        .then((response) => {
            req.session.mekanAdi = response.data.ad;
            detaySayfasiOlustur(res, response.data);
        })
        .catch((hata) => {
            hataGoster(res, hata);
        });
};

const yorumEkle = function(req, res, next) {
    let mekanAdi = req.session.mekanAdi;
    let mekanid = req.params.mekanid;
    if (!mekanAdi) {
        res.redirect("/mekan/" + mekanid);
    } else {
        res.render("yorumekle", {
            baslik: mekanAdi + " mekanina yorum Ekle",
        });
    }
};

const yorummumuEkle = (req, res) => {
    let gonderilenYorum;
    const { mekanid } = req.params;
    if (!req.body.adsoyad || !req.body.yorum) {
        res.redirect("/mekan/" + mekanid + "/yorum/yeni?hata=evet");
    } else {
        const { adsoyad, puan, yorum } = req.body;
        gonderilenYorum = {
            yorumYapan: adsoyad,
            puan,
            yorumMetni: yorum,
        };
        const { sunucu, apiYolu } = apiSecenekleri;
        let config = {
            headers: {
                Authorization: "Bearer " + req.session.token,
            },
        };
        axios
            .post(`${sunucu}${apiYolu}${mekanid}/yorumlar`, gonderilenYorum, config)
            .then((response) => {
                res.redirect("/mekan/".concat(mekanid));
            })
            .catch((err) => {
                hataGoster(res, err);
            });
    }
};
const mekanGuncelle = async(req, res, next) => {
    const { mekanid } = req.params;
    const body = {
        ad: req.body.ad,
        adres: req.body.adres,
        imkanlar: req.body.imkanlar,
        enlem: req.body.enlem,
        boylam: req.body.boylam,
        gunler1: req.body.gunler1,
        acilis1: req.body.acilis1,
        kapanis1: req.body.kapanis1,
        kapali1: req.body.kapali1,
        gunler2: req.body.gunler2,
        acilis2: req.body.acilis2,
        kapanis2: req.body.kapanis2,
        kapali2: req.body.kapali2,
    };
    const { sunucu, apiYolu } = apiSecenekleri;

    try {
        const response = await axios.put(`${sunucu}${apiYolu}${mekanid}`, body);
        res.redirect("/adminpage");
    } catch (error) {
        console.log(error);
    }
};
const mekanGuncelleSayfasi = async(req, res, next) => {
    const { mekanid } = req.params;
    const { sunucu, apiYolu } = apiSecenekleri;
    try {
        const response = await axios.get(`${sunucu}${apiYolu}${mekanid}`);
        response.data.koordinat = {
            enlem: response.data.koordinat[0],
            boylam: response.data.koordinat[1],
        };
        let imkanlar = response.data.imkanlar.toString();
        res.render("mekanGuncelle", {
            mekanDetay: response.data,
            imkanlar,
            kapali1: new String(response.data.saatler[0].kapali).replace('""'),
            kapali2: new String(response.data.saatler[1].kapali).replace('""'),
        });
    } catch (error) {}
};

const mekanEkleSayfasi = function(req, res, next) {
    res.render("mekanEkle", { title: "Yeni Mekan Ekle Sayfası" });
};

const yeniMekanEkle = async(req, res) => {
    const body = {
        ad: req.body.ad,
        adres: req.body.adres,
        imkanlar: req.body.imkanlar,
        enlem: req.body.enlem,
        boylam: req.body.boylam,
        gunler1: req.body.gunler1,
        acilis1: req.body.acilis1,
        kapanis1: req.body.kapanis1,
        kapali1: req.body.kapali1,
        gunler2: req.body.gunler2,
        acilis2: req.body.acilis2,
        kapanis2: req.body.kapanis2,
        kapali2: req.body.kapali2,
    };
    const { sunucu, apiYolu } = apiSecenekleri;
    console.log(body);
    try {
        const response = await axios.post(`${sunucu}${apiYolu}`, body);
        res.redirect("/adminpage");
    } catch (error) {}
};

const mekanSil = async(req, res) => {
    const { mekanid } = req.params;
    const { sunucu, apiYolu } = apiSecenekleri;
    try {
        const response = await axios.delete(`${sunucu}${apiYolu}${mekanid}`);
        res.redirect("/adminpage");
    } catch (error) {
        res.redirect("/adminpage");
    }
};

module.exports = {
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
    yorummumuEkle,
    anaSayfaOlustur,
    mekanGuncelle,
    yeniMekanEkle,
    mekanGuncelleSayfasi,
    mekanSil,
    mekanEkleSayfasi,
};