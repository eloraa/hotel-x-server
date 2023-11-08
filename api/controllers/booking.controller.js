const httpStatus = require("http-status");
const { roomCollection, bookingCollection } = require("../../config/mongodb");
const APIError = require("../errors/api-error");
const jwt = require('jsonwebtoken')
const { pick } = require("lodash");
const { jwtSecret } = require("../../config/vars");
const { ObjectId } = require("mongodb");

exports.book = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const userData = pick(req.body, "email", "uid", 'roomId');



        if(!accessToken['access-token']) return res.status(httpStatus.UNAUTHORIZED).json({
            message: "UNAUTHORIZED",
        });



        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === userData.uid) {

            const room = await roomCollection.findOne({ _id: new ObjectId(userData.roomId)  })
            if(room.remaining_count === 0) throw new APIError({ message: 'BAD REQUEST', status: httpStatus.BAD_REQUEST })

            const result = await bookingCollection.insertOne({ ...userData, uid: data.sub })
            if(result.acknowledged) {
                const result = await roomCollection.updateOne({ _id: new ObjectId(userData.roomId) }, { $inc: { remaining_count: -1 } })
                console.log(userData.roomId);
                if(result.modifiedCount) {
                    return res.json({ success: true })
                }
                else throw new APIError({ message: 'Something went wrong', status: httpStatus.NOT_MODIFIED })
            }
            else throw new APIError({ message: 'Something went wrong', status: httpStatus.NOT_MODIFIED })
        }
        else return res.status(httpStatus.UNAUTHORIZED).json({
                message: "UNAUTHORIZED",
            });
    } catch (error) {
        next(error);
    }
};
