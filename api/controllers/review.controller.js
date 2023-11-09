const { reviewCollection, userCollection } = require("../../config/mongodb");
const jwt = require("jsonwebtoken");
const { pick, map, merge, find } = require("lodash");
const { jwtSecret } = require("../../config/vars");
const { ObjectId } = require("mongodb");
const httpStatus = require("http-status");

exports.get = async (req, res, next) => {
    try {
        const reviews = await reviewCollection.find({
            roomId: req.params.id,
        }).toArray();
        if(reviews.length) {
            const filter = map(reviews, "uid");
            const query = { uid: { $in: filter } };
            const users = await userCollection.find(query).toArray()
            const data = map(reviews, (review) => {
                const matching = find(users, { uid: review.uid });
                if (matching) {
                    return merge({}, review, matching);
                } else {
                    return review;
                }
            });
            return res.json(data)
        }
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

exports.add = async (req, res, next) => {
    try {
        const accessToken = pick(req.cookies, "access-token");
        const userData = pick(req.body, "email", "uid", "roomId", "date");

        if (!accessToken["access-token"])
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Unauthorized",
            });

        const data = jwt.verify(accessToken["access-token"], jwtSecret);

        if (data && data.sub === userData.uid) {
            const reviewData = pick(
                req.body,
                "name",
                "details",
                "rating",
                "uid",
                "roomId"
            );
            console.log(reviewData);
            const result = await reviewCollection.insertOne(reviewData);
            if (result.insertedId) {
                return res.json({ success: true });
            } else {
                return res.json({ success: false })
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
