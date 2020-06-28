const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; //Authorization : Bearer <token>

    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decordToken;
    try {
        decordToken = jwt.verify(token, 'thisistest');
        
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if (!decordToken) {
        req.isAuth = false
        return next();
    }
    req.isAuth = true;
    req.userId = decordToken.userId;
    if (decordToken.role.cus) {
        req.role = "customer"
    }
    if (decordToken.role.adm) {
        req.role = "admin"
    }
    if (decordToken.role.mrc) {
        req.role = "merchant"
    }
    next();
}