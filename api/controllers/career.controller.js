const { json } = require("body-parser");
const { carrerCollection } = require("../../config/mongodb");

exports.list = async (req, res, next) => {
    try {
        const jobs = await carrerCollection.find().toArray();
        console.log(jobs);
        return res.json(jobs);
    } catch (error) {
        next(error);
    }
};
