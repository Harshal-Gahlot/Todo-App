const jwt = require("jsonwebtoken");

const JWT_SECRET = "xyz";

function auth(req, res, next) {
    const token = req.headers.token;
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