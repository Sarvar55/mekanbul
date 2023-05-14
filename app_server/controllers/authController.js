const axios = require("axios");
const ctrlMekanlar = require("../controllers/mekanlar");

const apiSecenekleri = {
    sunucu: "http://localhost:3000",
    apiYolu: "/api/",
};

const adminSayfasi = (req, res, next) => {
    const { sunucu, apiYolu } = apiSecenekleri;
    axios
        .get(sunucu.concat(apiYolu).concat("mekanlar") + "/?enlem=37&boylam=31")
        .then((response) => {
            console.log(response.data);
            ctrlMekanlar.anaSayfaOlustur(res, response.data, "adminpage");
        })
        .catch((hata) => {
            ctrlMekanlar.anaSayfaOlustur(res, hata);
        });
};

const login = async(req, res, next) => {
    const { eposta, sifre } = req.body;
    if (!eposta || !sifre) {
        return;
    }
    const body = {
        sifre,
        eposta,
    };
    const { sunucu, apiYolu } = apiSecenekleri;
    try {
        const response = await axios.post(`${sunucu}${apiYolu}login`, body);
        req.session.token = response.data.token;
        res.redirect("/adminpage");
    } catch (error) {
        res.redirect("/login");
    }
};

const loginPage = (req, res, next) => {
    res.render("login", { title: "Kayıt Ol Sayfası" });
};

const signUpPage = (req, res, next) => {
    res.render("signup", { title: "Giris Yap Sayfası" });
};

const signUp = async(req, res, next) => {
    if (!req.body.sifre || !req.body.eposta || !req.body.adsoyad) {
        return;
    }
    const body = {
        sifre: req.body.sifre,
        eposta: req.body.eposta,
        adsoyad: req.body.adsoyad,
    };

    const { sunucu, apiYolu } = apiSecenekleri;
    try {
        const response = await axios.post(`${sunucu}${apiYolu}signup`, body);
        res.redirect("/login");
    } catch (error) {
        res.redirect("/signup");
    }
};

const getUserDeatils = async(req, res) => {
    let userId = req.session.userId;
    if (!userId) return res.redirect("/login");

    const { sunucu, apiYolu } = apiSecenekleri;

    try {
        const response = await axios.get(
            `${sunucu}${apiYolu}kullanicigetir/${userId}`
        );
        res.render("kullanicibilgisi", { kullanici: response.data });
    } catch (error) {
        console.log(error);
        res.redirect("/signup");
    }
};

const logout = (req, res) => {
    if (req.session && (req.session.userId || req.session.token)) {
        req.session.destroy((err) => {
            if (!err) res.redirect("/login");
        });
    }
};

module.exports = {
    login,
    signUp,
    adminSayfasi,
    loginPage,
    signUpPage,
    logout,
    getUserDeatils,
};