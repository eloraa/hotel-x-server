const Joi = require('joi')

module.exports = {
  newsletterEmail: {
    body: {
      email: Joi.string().email().required()
    }
  }
}
