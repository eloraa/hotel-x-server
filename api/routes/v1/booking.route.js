const express = require("express");
const controller = require("../../controllers/booking.controller");
const router = express.Router();
const validate = require("express-validation");
const { book, get } = require("../../validations/booking.validation");
router
    .route("/:uid")

    .get(validate(get), controller.list);
router
    .route("/book")

    .post(validate(book), controller.book);
router
    .route("/")

    .put(validate(book), controller.delete);

module.exports = router;
