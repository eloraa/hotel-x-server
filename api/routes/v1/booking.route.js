const express = require('express');
const controller = require('../../controllers/booking.controller');
const router = express.Router();
const validate = require('express-validation');
const { book } = require('../../validations/booking.validation');

router
      .route('/book')

      .post(validate(book), controller.book)



module.exports = router;
