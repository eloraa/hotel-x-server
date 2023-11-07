const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/auth.controller");

const { add } = require("../../validations/auth.validation");

const router = express.Router();

router
    .route("/add")

    .post(validate(add), controller.add);

module.exports = router;
