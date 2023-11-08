const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../../config/vars");

const RefreshToken = require("../utils/Refreshtoken.utils");
const { userCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");
const { pick } = require("lodash");

async function generateTokenResponse(user, accessToken) {
    const tokenType = "Bearer";
    const tokens = await RefreshToken.generate(user);
    const refreshToken = tokens.token;
    const maxAge = tokens.expires;
    const expiresIn = moment().add(jwtExpirationInterval, "minutes");
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
        maxAge,
    };
}

exports.add = async (req, res, next) => {
    try {
        const userData = pick(req.body, "uid", "email");
        const exists = await userCollection.findOne({
            $or: [{ uid: userData.uid }, { email: userData.email }],
        });
        if (!exists) {
            const user = await userCollection.insertOne(userData);
            if (user.acknowledged) {
                const token = await generateTokenResponse(
                    userData,
                    RefreshToken.token(userData)
                );
                res.status(httpStatus.CREATED);
                return res
                    .cookie("access-token", token.accessToken, {
                        expires: moment(token.expiresIn).toDate(),
                        httpOnly: true,
                    })
                    .cookie("refresh-token", token.refreshToken, {
                        expires: token.maxAge,
                        httpOnly: true,
                    })
                    .json({
                        expires: token.expiresIn,
                    });
            } else throw new Error("Something went wrong");
        } else {
            throw new APIError({
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
        }
    } catch (error) {
        return next(error);
    }
};
exports.get = async (req, res, next) => {
    try {
        const userData = pick(req.body, "uid", "email");

        const err = {
            status: httpStatus.UNAUTHORIZED,
            message: "User not found",
            isPublic: true,
        };

        const user = await userCollection.findOne(userData);
        if (user) {
            const token = await generateTokenResponse(
                user,
                RefreshToken.token(user)
            );

            return res
                .cookie("access-token", token.accessToken, {
                    expires: moment(token.expiresIn).toDate(),
                    httpOnly: true,
                })
                .cookie("refresh-token", token.refreshToken, {
                    expires: token.maxAge,
                    httpOnly: true,
                })
                .json({
                    expires: token.expiresIn,
                });
        } else throw new APIError(err);
    } catch (error) {
        return next(error);
    }
};
