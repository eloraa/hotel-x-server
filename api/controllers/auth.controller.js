const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../../config/vars");
const { omit, pick } = require("lodash");

const RefreshToken = require("../utils/Refreshtoken.utils");
const { userCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");

async function generateTokenResponse(user, accessToken) {
    const tokenType = "Bearer";
    const refreshToken =  (await RefreshToken.generate(user)).token;
    const expiresIn = moment().add(jwtExpirationInterval, "minutes");
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    };
}

exports.add = async (req, res, next) => {
    try {
        const userData = omit(req.body, "role");
        const exists = await userCollection.findOne(pick(userData, "uid"));
        if (!exists) {
            const user = await userCollection.insertOne(userData);
            if (user.acknowledged) {
                const token = await generateTokenResponse(
                    userData,
                    RefreshToken.token(userData)
                );
                res.status(httpStatus.CREATED);
                return res.json({
                    token,
                });
            } else throw new Error("Something went wrong");
        } else {
            throw new APIError({
                message: "Validation Error",
                errors: [
                    {
                        field: "uid",
                        location: "body",
                        messages: ['"uid" already exists'],
                    },
                ],
                status: httpStatus.CONFLICT,
                isPublic: true,
            });
        }
    } catch (error) {
        return next(error);
    }
};
