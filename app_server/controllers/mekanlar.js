var express = require("express");
var router = express.Router();

const anaSayfa = function(req, res, next) {
    res.render("anasayfa", {
        baslik: "AnaSayfa",
        sayfaBaslik: {
            siteAd: "MekanBul",
            slogan: "Civardaki Makenlari kesfet",
        },
        mekanlar: [{
                ad: "Starbucks",
                adres: "Centrum Garden AVM",
                puan: "4",
                imkanlar: ["Dünya Kahveleri", "Kekler", "Pastalar"],
                mesafe: "10km",
            },
            {
                ad: "Gloria Jeans",
                adres: "Sdu Dogu Kampusu",
                puan: "3",
                imkanlar: ["Kahve", "Cay", "Pastal"],
                mesafe: "5km",
            },
        ],
    });
};
const mekanBilgisi = (req, res, next) => {
    res.render("mekanbilgisi", {
        baslik: "Mekan Biligisi",
        mekanBaslik: "Starbucks",
        mekanDetay: {
            ad: "StarBUcks",
            adres: "Centrum Garden AVM",
            puan: "4",
            imkanlar: ["Dunya Kahveleri", "Kekler", "PAstalar"],
            kordinatlar: {
                enlem: "37.7",
                boylam: "30.5",
            },
            saatler: [{
                    gunler: "Pazartesi-Cuma",
                    acilis: "9:00-23:00",
                    kapali: false,
                },
                {
                    gunler: "Pazartesi-Cuma",
                    acilis: "9:00-23:00",
                    kapali: false,
                },
            ],
            yorumlar: [{
                yorumYapan: "Sarvar Musazade",
                puan: "4",
                tarih: "20 Ekim 2022",
                yorumMetni: "Kahveler iyi",
            }, ],
        },
    });
};
const yorumEkle = (req, res, next) => {
    res.render("yorumekle", { title: "Yorum ekle" });
};

module.exports = {
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
};