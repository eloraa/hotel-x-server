const { ObjectId } = require("mongodb");
const { roomCollection } = require("../../config/mongodb");

exports.list = async (req, res, next) => {
    try {
        const rooms = await roomCollection.find().toArray();
        res.json(rooms);
    } catch (error) {
        next(error);
    }
};

exports.featured = async (req, res, next) => {
    try {
        const rooms = await roomCollection
            .find({ is_featured: true })
            .toArray();
        res.json(rooms);
    } catch (error) {
        next(error);
    }
};
exports.get = async (req, res, next) => {
    try {
        const room = await roomCollection.findOne({
            _id: new ObjectId(req.params.id),
        });
        res.json(room);
    } catch (error) {
        next(error);
    }
};
