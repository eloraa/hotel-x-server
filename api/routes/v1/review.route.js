const express = require("express");
const controller = require("../../controllers/review.controller");
const router = express.Router();
const validate = require("express-validation");
const { add } = require("../../validations/review.validation");
const { get } = require("lodash");


router
    .route("/")

    .get(controller.latest);
router
    .route("/:id")

    .get(validate(get), controller.get);
router
    .route("/")

    .post(validate(add), controller.add);

module.exports = router;
