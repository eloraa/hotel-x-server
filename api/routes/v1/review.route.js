const express = require("express");
const controller = require("../../controllers/review.controller");
const router = express.Router();
const validate = require("express-validation");
const { add } = require("../../validations/review.validation");


router
    .route("/")

    .post(validate(add), controller.add);

module.exports = router;
