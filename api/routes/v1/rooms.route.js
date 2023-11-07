const express = require('express');
const controller = require('../../controllers/rooms.controller');
const router = express.Router();

router
  .route('/')

  .get(controller.list)



module.exports = router;
