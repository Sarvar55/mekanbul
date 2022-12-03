var express = require("express");
var router = express.Router();
const axios = require("axios");

const apiSecenekleri = {
    sunucu: "https://mekanbul.servermusazade.repl.co",
    apiYolu: "/api/mekanlar/",
};

const mesafeyiFormatla = ({ mesafe }) => {
    let yeniMesafe, birim;
    if (mesafe > 1) {
        yeniMesafe = parseFloat(mesafe).toFixed(1);
        birim = " km";
    } else {
        yeniMesafe = parseInt(mesafe * 1000, 10);
        birim = " m";
    }

    return yeniMesafe.concat(birim);
};

const anaSayfaOlustur = (res, mekanListesi) => {
    let mesaj;
    if (!(mekanListesi instanceof Array)) {
        mesaj = "API Hatasi:Bir seyler ters gitdi";
        mekanListesi = [];
    } else {
        if (!mekanListesi.length) {
            mesaj = "Civarda herhengi bir mekan yok";
        }
    }
    res.render("anaSayfa", {
        baslik: "Anasayfa",
        sayfaBaslik: {
            siteAd: "MekanBul",
            slogan: "Civardaki Makenlari kesfet",
        },
        mekanlar: mekanListesi,
        mesaj,
    });
};

const anaSayfa = function(req, res) {
    const { sunucu, apiYolu } = apiSecenekleri;
    axios
        .get(sunucu.concat(apiYolu), {
            params: {
                enlem: req.query.enlem,
                boylam: req.query.boylam,
            },
        })
        .then((response) => {
            mekanlar = response.data.map((mekan) => {
                mesafe = mesafeyiFormatla(mekan);
                return {
                    ...mekan,
                    mesafe,
                };
            });
            anaSayfaOlustur(res, mekanlar);
        })
        .catch((error) => {
            anaSayfaOlustur(res, error);
            console.log(JSON.stringify(error));
        });
};
const detaySayfasiOlustur = (res, mekanDetaylari) => {
    mekanDetaylari.koordinat = {
        enlem: mekanDetaylari.koordinat[0],
        boylam: mekanDetaylari.koordinat[1],
    };
    res.render("mekanbilgisi", {
        mekanBaslik: mekanDetaylari.ad,
        mekanDetay: mekanDetaylari,
    });
};

const mekanBilgisi = (req, res) => {
    const { sunucu, apiYolu } = apiSecenekleri;
    const { mekanid } = req.params;
    axios
        .get(sunucu.concat(apiYolu) + mekanid)
        .then((response) => {
            detaySayfasiOlustur(res, response.data);
        })
        .catch((error) => {
            hataGoster(res, error);
        });
};
const yorumEkle = (req, res, next) => {
    res.render("yorumekle", { title: "Yorum ekle" });
};
const hataGoster = (res, hata) => {
    let mesaj;
    if (hata.response.status == 404) mesaj = "404 Sayfa bulunamadi";
    else mesaj = hata.response.status + "hatasi";
    res.status(hata.response.status);
    res.render("error", {
        mesaj,
    });
};

module.exports = {
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
};