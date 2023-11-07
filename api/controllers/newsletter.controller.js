const { pick } = require("lodash");
const { db } = require("../../config/mongodb");
const httpStatus = require("http-status");
const APIError = require("../errors/api-error");

const newletterCollection = db.collection("newsletter");
exports.add = async (req, res, next) => {
    try {
        const email = pick(req.body, ["email"]);

        const existed = await newletterCollection.findOne(email);
        if (existed) {
            const error = new APIError({
                message: "Validation Error",
                errors: [
                    {
                        field: "email",
                        location: "body",
                        messages: ['"email" already exists'],
                    },
                ],
                status: httpStatus.CONFLICT,
                isPublic: true,
            });
            return next(error)
        }

        const result = await newletterCollection.insertOne(email);
        if (result.insertedId) {
            res.status(httpStatus.CREATED);
            return res.json({
                success: true,
            });
        } else {
            return res.json({
                success: false,
            });
        }
    } catch (error) {
        next(error);
    }
};
