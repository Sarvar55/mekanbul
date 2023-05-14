const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Kullanici = mongoose.model("kullanici");

passport.use(
    new LocalStrategy({
            usernameField: "eposta",
            passwordField: "sifre",
        },
        (eposta, sifre, done) => {
            Kullanici.findOne({ eposta: eposta }, (hata, kullanici) => {
                if (hata) {
                    return done(hata);
                }
                if (!kullanici) {
                    console.log("buraya ");
                    return done(null, false, { message: "Yalnis Kullanici adi" });
                }
                if (!kullanici.sifreDogrumu(sifre)) {
                    return done(null, false, {
                        message: "Yalnis Sifre",
                    });
                }
                return done(null, kullanici);
            });
        }
    )
);