const experss = require("express");
const jwt = require("express-jwt");
const router = experss.Router();
const jsonwebtoken = require("jsonwebtoken");

const getTokenFromHeaders = (req) => {
    const {
        headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === "Bearer")
        return authorization.split(" ")[1];

    return null;
};

const auth = jwt.expressjwt({
    secret: process.env.SECRET_KEY,
    userPorperty: "payload",
    algorithms: ["sha1", "RSA256", "HS256"],
    getToken: getTokenFromHeaders,
});

module.exports = {
    auth,
};