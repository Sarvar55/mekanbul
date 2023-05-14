const passport = require("passport");
const mongoose = require("mongoose");
const Kullanici = mongoose.model("kullanici");

const kayitOl = (req, res) => {
    if (!req.body.adsoyad || !req.body.eposta || !req.body.sifre) {
        return res.status(400).json({ mesaj: "Tüm alanlar gerekli." });
    }

    const kullanici = new Kullanici();
    kullanici.adsoyad = req.body.adsoyad;
    kullanici.eposta = req.body.eposta;
    kullanici.sifreAyarla(req.body.sifre);
    kullanici.save((hata) => {
        if (hata) {
            res.status(404).json(hata);
        } else {
            const token = kullanici.tokenUret();
            res.status(200).json({ token });
        }
    });
};

const girisYap = (req, res) => {
    if (!req.body.eposta || !req.body.sifre) {
        return res.status(400).json({ mesaj: "Tüm alanlar gerekli." });
    }
    passport.authenticate("local", (err, kullanici, info) => {
        let token;
        if (err) {
            return res.status(404).json(err);
        }
        if (kullanici) {
            token = kullanici.tokenUret();
            res.status(200).json({ token });
        } else {
            return res.status(401).json(info);
        }
    })(req, res);
};

const kullaniciGetir = (req, res) => {
    const { userId } = req.params;
    if (userId) {
        Kullanici.findById(userId).exec(function(hata, user) {
            if (!user) {
                res.status(404).json("kullanici yok");
            } else if (hata) {
                res.status(404).json("hata kullanic bulunamadi");
            } else {
                res.json(user);
            }
        });
    } else {
        res.json("userId gerekli bir alan");
    }
};
passport.serializeUser(function(user, done) {
    console.log("Serialize user called.");
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
    Kullanici.findById(id.toString(), (err, user) => {
        done(err, user);
    });
});

module.exports = {
    kayitOl,
    kullaniciGetir,
    girisYap,
};