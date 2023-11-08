const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/auth.controller");

const { add, get } = require("../../validations/auth.validation");

const router = express.Router();

router
    .route("/add-user")

    .post(validate(add), controller.add);

router
    .route("/get-token")

    .post(validate(get), controller.get);

module.exports = router;
