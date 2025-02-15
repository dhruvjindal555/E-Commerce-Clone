var jwt = require('jsonwebtoken');
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY


function fetchUser(req, res, next) {
    const token = req.header('authToken');
    if(!token) return res.status(401).json({success: false,message: 'Token not found'})
    try {
        let decoded = jwt.verify(token, SECRET_KEY);
        if(decoded){
            req.user = decoded.user;
            next();
        }
    } catch (err) {
        console.log(err.message)
        return res.status(401).send("Some error occured")
    }
}

module.exports = fetchUser;