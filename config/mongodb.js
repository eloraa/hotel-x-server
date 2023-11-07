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

    return client;
};

/**
* returns client
*/
exports.client =  client;
exports.db =  client.db(dbname);
exports.roomCollection =  client.db(dbname).collection('rooms');
exports.userCollection =  client.db(dbname).collection('users');
exports.tokenCollection =  client.db(dbname).collection('tokens');
