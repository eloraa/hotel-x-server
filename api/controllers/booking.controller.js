const httpStatus = require("http-status");
const { roomCollection, bookingCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");
const jwt = require("jsonwebtoken");
const { pick, map, find, merge } = require("lodash");
const { jwtSecret } = require("../../config/vars");
const { ObjectId } = require("mongodb");

exports.list = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const uid = req.params.uid;

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === uid) {
            const bookings = await bookingCollection
                .find({ uid: req.params.uid })
                .toArray();
            const roomId = map(bookings, "roomId");
            const filter = map(roomId, (id) => new ObjectId(id));
            const query = { _id: { $in: filter } };
            const rooms = await roomCollection.find(query).toArray();

            const data = map(bookings, (booking) => {
                const matchingProduct = find(rooms, {
                    _id: new ObjectId(booking.roomId),
                });
                if (matchingProduct) {
                    return merge({}, booking, matchingProduct);
                } else {
                    return booking;
                }
            });
            return res.json(data);
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.book = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const userData = pick(req.body, "email", "uid", "roomId", "date");

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === userData.uid) {
            const exists = await bookingCollection.findOne(userData);

            if (exists) return res.json({ sucess: false });

            const room = await roomCollection.findOne({
                _id: new ObjectId(userData.roomId),
            });
            if (room.remaining_count === 0)
                throw new APIError({
                    message: "BAD REQUEST",
                    status: httpStatus.BAD_REQUEST,
                });

            const result = await bookingCollection.insertOne({
                ...userData,
                uid: data.sub,
            });
            if (result.acknowledged) {
                const result = await roomCollection.updateOne(
                    { _id: new ObjectId(userData.roomId) },
                    { $inc: { remaining_count: -1 } }
                );
                if (result.modifiedCount) {
                    return res.json({ success: true });
                } else
                    throw new APIError({
                        message: "Something went wrong",
                        status: httpStatus.NOT_MODIFIED,
                    });
            } else
                throw new APIError({
                    message: "Something went wrong",
                    status: httpStatus.NOT_MODIFIED,
                });
        } else
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const room = pick(req.body, "uid", "roomId");

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === room.uid) {
            const result = await bookingCollection.deleteOne(room);
            if (result.deletedCount) {
                const result = await roomCollection.updateOne(
                    { _id: new ObjectId(room.roomId) },
                    { $inc: { remaining_count: 1 } }
                );
                if (result.modifiedCount) {
                    return res.json({ success: true });
                } else {
                    throw new APIError({
                        message: "Something went wrong",
                        status: httpStatus.NOT_MODIFIED,
                    });
                }
            } else {
                res.status(httpStatus.BAD_REQUEST);
                return res.json({ success: false });
            }
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const room = pick(req.body, "uid", "roomId");

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === room.uid) {
            const result = await bookingCollection.updateOne(room, { $set: { date: req.body.date } });
            if (result.matchedCount) {
                return res.json({ success: true });
            } else {
                res.status(httpStatus.BAD_REQUEST);
                return res.json({ success: false });
            }
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });
        }
    } catch (error) {
        next(error);
    }
};

