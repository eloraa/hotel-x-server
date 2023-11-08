const httpStatus = require("http-status");
const { roomCollection, bookingCollection, reviewCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");
const jwt = require("jsonwebtoken");
const { pick, map, find, merge } = require("lodash");
const { jwtSecret } = require("../../config/vars");
const { ObjectId } = require("mongodb");

exports.get = async (req, res, next) => {
    try {
        const reviews = await reviewCollection.findOne({
            roomId: req.params.id,
        });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

exports.add = async (req, res, next) => {
    try {
        const reviews = await reviewCollection.insertOne({
            roomId: req.body.id,
            ratings: re
        });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

