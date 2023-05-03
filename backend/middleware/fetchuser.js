const jwt = require('jsonwebtoken')

const fetchuser = (req, res, next) => {
    const token = req.header('authentication');
    if (!token) {
        res.status(401).json({ error: "Please authentication with the valid token" })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(404).json({ error: "Please authenticate wiht the valid token" })
    }
}

module.exports = fetchuser