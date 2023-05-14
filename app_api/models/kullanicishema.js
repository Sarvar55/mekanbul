const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const kullanicishema = new mongoose.Schema({
    eposta: {
        type: String,
        unique: true,
        required: true,
    },
    adsoyad: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
    },
    salt: {
        type: String,
    },
    token: {
        type: String,
    },
});

kullanicishema.methods.sifreAyarla = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
};

kullanicishema.methods.sifreDogrumu = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");

    return this.hash == hash;
};
kullanicishema.methods.tokenUret = function() {
    const skt = new Date();
    skt.setDate(skt.getDate() + 7);
    return jwt.sign({
            _id: this._id,
            eposta: this.eposta,
            adsoyad: this.adsoyad,
            exp: parseInt(skt.getTime() / 1000, 10),
        },
        process.env.SECRET_KEY
    );
};

mongoose.model("kullanici", kullanicishema, "kullanicilar");