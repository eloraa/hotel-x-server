const logger = require("./logger");
const { mongo, dbname } = require("./vars");
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(mongo.uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});



/**
 * Connect to mongo db
 */
exports.connect = () => {
    client
        .connect()
        .then(() =>client.db(dbname).command({ ping: 1 }))
        .then(() => logger.info("mongoDB connected..."))
        .catch((error) => {
            logger.error(error)
            process.exit(-1)
        })

    return client;
};

/**
* returns client
*/
exports.client =  client;
exports.db =  client.db(dbname);
exports.roomCollection =  this.db.collection('rooms');
exports.userCollection =  this.db.collection('users');
exports.tokenCollection =  this.db.collection('tokens');
exports.bookingCollection =  this.db.collection('bookings');
exports.reviewCollection =  this.db.collection('reviews');
exports.carrerCollection =  this.db.collection('careers');
