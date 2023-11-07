const { roomCollections } = require("../../config/mongodb");

exports.list = async (req, res, next) => {
    try {
        const rooms = await roomCollection.find().toArray();
        res.json(rooms);
    } catch (error) {
        next(error);
    }
};
