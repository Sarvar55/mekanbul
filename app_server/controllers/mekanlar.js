var express = require("express");
const axios = require("axios");

var apiSecenekleri = {
    // sunucu: "http://localhost:3000",
    sunucu: "https://mekanbul.servermusazade.repl.co",
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
const anaSayfaOlustur = (res, mekanListesi) => {
    let mesaj;
    if (!(mekanListesi instanceof Array)) {
        mesaj = "API HATASI: Bir şeyler ters gitti.";
        mekanListesi = [];
    } else {
        if (!mekanListesi.length) {
            mesaj = "Civarda herhangi bir mekan yok";
        }
    }
    res.render("anasayfa", {
        baslik: "Anasayfa",
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
    let mesaj;
    if (hata.response.status == 404) mesaj = "404, Sayfa Bulunamadı!";
    else mesaj = hata.response.status + " hatası";

    res.status(hata.response.status);
    res.render("error", {
        mesaj: mesaj,
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
    axios
        .get(sunucu.concat(apiYolu) + mekanid)
        .then((response) => {
            detaySayfasiOlustur(res, response.data);
        })
        .catch((hata) => {
            hataGoster(res, hata);
        });
};

const yorumEkle = function(req, res, next) {
    res.render("yorumekle", { title: "Yorum Ekle" });
};

module.exports = {
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
};