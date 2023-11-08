const express = require('express');
const controller = require('../../controllers/rooms.controller');
const router = express.Router();
const validate = require('express-validation');
const { get } = require('../../validations/room.validation');

router
  .route('/')

  .get(controller.list)

router
  .route('/featured')

  .get(controller.featured)

router
      .route('/:id')

      .get(validate(get), controller.get)



module.exports = router;
