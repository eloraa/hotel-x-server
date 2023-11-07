const Joi = require("joi");

module.exports = {
    add: {
        body: {
            email: Joi.string().email().required(),
            uid: Joi.string().min(5).required(),
        },
    },
    login: {
        body: {
            email: Joi.string().email().required(),
            uid: Joi.string().min(5).required(),
        },
    },
    refresh: {
        body: {
            email: Joi.string().email().required(),
            refreshToken: Joi.string().required(),
        },
    },
};
