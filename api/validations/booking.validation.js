const Joi = require('joi')

module.exports = {
  get: {
    params: {
        uid: Joi.string().min(5).required(),
    }
  },
  book: {
    body: {
        uid: Joi.string().min(5).required(),
        roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  }
}
