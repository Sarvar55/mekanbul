const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let token = req.session.token;
    if (!token) return res.redirect("/login");

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) return res.redirect("/?enlem=12&boylam=36");
        req.session.userId = data._id;
        req.headers["authorization"] = token;
        next();
    });
};

module.exports = {
    authenticateToken,
};