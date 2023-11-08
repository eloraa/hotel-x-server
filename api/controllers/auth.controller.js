const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { jwtExpirationInterval, jwtSecret } = require("../../config/vars");
const jwt = require("jsonwebtoken");

const RefreshToken = require("../utils/Refreshtoken.utils");
const { userCollection, tokenCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");
const { pick, isEmpty } = require("lodash");

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
        const userData = pick(req.body, "uid", "email", "photoURL");
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
                        secure: true,
                        sameSite: "none",
                    })
                    .cookie("refresh-token", token.refreshToken, {
                        expires: token.maxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
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

exports.update = async (req, res, next) => {
    try {
        const user = pick(req.body, "uid", "email");
        const accessToken = pick(req.cookies, "access-token");

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === user.uid) {
            const result = await userCollection.updateOne(user, {
                $set: { photoURL: req.body.photoURL },
            });
            if (result.modifiedCount) return res.json({ success: true });
            else return res.json({ success: false });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
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
                    secure: true,
                    sameSite: "none",
                })
                .cookie("refresh-token", token.refreshToken, {
                    expires: token.maxAge,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                .json({
                    expires: token.expiresIn,
                });
        } else throw new APIError(err);
    } catch (error) {
        return next(error);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const userData = pick(req.body, "uid", "email");

        const refreshToken = pick(req.cookies, "refresh-token");

        const err = {
            status: httpStatus.UNAUTHORIZED,
            message: "UNAUTHORIZED",
            isPublic: true,
        };
        if (isEmpty(refreshToken)) {
            throw new APIError(err);
        }

        const tokens = await tokenCollection.findOne({
            token: refreshToken["refresh-token"],
            userId: userData.uid,
        });
        const expiresIn = moment().add(jwtExpirationInterval, "minutes");
        if (tokens) {
            if (moment(tokens.expires).isBefore()) {
                await tokenCollection.findOneAndDelete({
                    token: refreshToken["refresh-token"],
                    userId: userData.uid,
                });
                throw new APIError(err);
            }

            const token = RefreshToken.token(userData);
            console.log(token);
            return res
                .cookie("access-token", token, {
                    expires: moment(expiresIn).toDate(),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                .json({
                    expires: expiresIn,
                });
        } else throw new APIError(err);
    } catch (error) {
        return next(error);
    }
};
