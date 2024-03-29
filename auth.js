const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // The local passport file

/** 
 * Generates Token to be passed in the Header as verification
 * @function generateJWTToken
 * @param {Object} user 
 * @returns {Object} user
 * 
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, // The username encoded in the JWT
        expiresIn: '7d',
        algorithm: 'HS256' // algorithm to sign ir encode the values of the JWT
    });
}

module.exports = (router) => {
    /** 
     * API request to login - when successful, create token
     * @function [post]/login
     * @param {string} user  request from user login form
     * @returns {Object} user name and token
     * @requires passport
     * **/
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something went wrong',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user: user, token: token });
            });
        })(req, res);
    });
}