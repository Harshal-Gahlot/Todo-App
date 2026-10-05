const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT;

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        res.status(403).send("Token not provided");
        return;
    }

    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData) {
        req.userId = decodedData.id;
        next();
    } else {
        res.status(403).send("Incorrect creds")
    }
}

module.exports = {
    auth,
    JWT_SECRET
}