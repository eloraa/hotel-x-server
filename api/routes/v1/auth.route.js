const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/auth.controller");

const { add, get, refresh } = require("../../validations/auth.validation");

const router = express.Router();

router
    .route("/add-user")

    .post(validate(add), controller.add);
router
    .route("/update-user")

    .post(validate(add), controller.update);

router
    .route("/get-token")

    .post(validate(get), controller.get);
router
    .route("/refresh-token")

    .post(validate(refresh), controller.refresh);

module.exports = router;
