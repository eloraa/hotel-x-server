const Joi = require('joi')

module.exports = {
  book: {
    body: {
        email: Joi.string().email().required(),
        uid: Joi.string().min(5).required(),
        roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  }
}
