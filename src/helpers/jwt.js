const jwt = require('jsonwebtoken');
const { MyError } = require('../models/my-error.model');

const SECRET_KEY = 'qucsq384uqvd';

function sign(obj) {
    return new Promise((resolve, reject) => {
        obj = JSON.parse(JSON.stringify(obj))
        jwt.sign(obj, SECRET_KEY, { expiresIn: '2 days' }, (error, token) => {
            if (error) return reject(error);
            resolve(token);
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (error, obj) => {
            if (error) return reject(new MyError("INVALID_TOKEN", 400));
            delete obj.exp;
            delete obj.iat;
            resolve(obj);
        });
    });
}

module.exports = { verify, sign };