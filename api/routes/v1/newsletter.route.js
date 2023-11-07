const express = require('express');
const controller = require('../../controllers/newsletter.controller');
const validate = require('express-validation')

const {
    newsletterEmail
} = require('../../validations/email.validation');

const router = express.Router();

router
  .route('/')

  .post(validate(newsletterEmail), controller.add)



module.exports = router;
