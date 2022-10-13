var express = require("express");
var router = express.Router();

const anaSayfa = function(req, res, next) {
    res.render("anasayfa", { title: "Ansayfa" });
};
// const mekanBilgisi = (req, res, next) => {
//     res.render("mekanbilgisi", { title: "Mekan Bilgisi" });
// };
const yorumEkle = (req, res, next) => {
    res.render("yorumekle", { title: "Yorum ekle" });
};
const mekanBilgisi = function(req, res) {
    const generateAddress = {
        "Starbucks": " İyaş Market Girişi",
        "Arabica": "İyaş Avm Girişi",
        "İyaş": "Otogar Karşısı"
    }
    console.log(generateAddress[req.params.title])
    res.render('mekanbilgisi', { title: req.params.title, address: generateAddress[req.params.title] });
};

module.exports = {
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
};