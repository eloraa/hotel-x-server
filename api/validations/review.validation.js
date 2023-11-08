const Joi = require('joi')

module.exports = {
  get: {
    params: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  },
  add: {
    body: {
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        details: Joi.string().min(15).required(),
        uid: Joi.string().min(5).required(),
        date: Joi.string().min(1).required(),
        roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  }
}
