var mongoose = require("mongoose");

var saatShema = new mongoose.Schema({
    gunler: { type: String, required: true },
    acilis: { type: String, required: false },
    kapanis: String,
    kapali: { type: Boolean, required: false },
});

var yorumShema = new mongoose.Schema({
    yorumYapan: { type: String, required: true },
    puan: { type: Number, default: 0, min: 0, max: 5 },
    yorumMetni: { type: String, required: true },
    tarih: { type: Date, default: Date.now },
});

var mekanShema = new mongoose.Schema({
    ad: { type: String, required: true },
    adres: String,
    puan: { type: Number, default: 0, min: 0, max: 5 },
    imkanlar: [String],
    koordinat: { type: [Number], index: "2dsphere" },
    saatler: [saatShema],
    yorumlar: [yorumShema],
});

mongoose.model("mekan", mekanShema, "mekanlar");