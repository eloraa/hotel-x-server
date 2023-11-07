var jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const crypto = require('crypto')
const { jwtSecret, jwtExpirationInterval } = require("../../config/vars");
const { tokenCollection } = require("../../config/mongodb");
module.exports = {
    generate: async (user) => {
        const userId = user.uid;
        const userEmail = user.email;
        const token = `${userId}.${crypto.randomBytes(40).toString("hex")}`;
        const expires = moment().add(30, "days").toDate();
        const tokenObject = {
            token,
            userId,
            userEmail,
            expires,
        };

        await tokenCollection.insertOne(tokenObject)
        return tokenObject;
    },
    token: (user) => {
        const payload = {
            exp: moment().add(jwtExpirationInterval, "minutes").unix(),
            iat: moment().unix(),
            sub: user.uid,
        };
        return jwt.sign(payload, jwtSecret);
    },
};
