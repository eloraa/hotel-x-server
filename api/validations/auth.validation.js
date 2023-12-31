const Joi = require("joi");

module.exports = {
    add: {
        body: {
            email: Joi.string().email().required(),
            uid: Joi.string().min(5).required(),
        },
    },
    get: {
        body: {
            email: Joi.string().email().required(),
            uid: Joi.string().min(5).required(),
        }
    },
    refresh: {
        body: {
            email: Joi.string().email().required(),
            uid: Joi.string().min(5).required(),
        }
    },
};
