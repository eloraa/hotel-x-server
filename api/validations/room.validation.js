const Joi = require('joi')

module.exports = {
  get: {
    params: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  }
}
