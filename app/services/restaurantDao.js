// ##################################
// ###### Add required modules ######
// ##################################
var logger = require('../utils/logger');
const configuration = require('../utils/configuration');
const mongodb = require('mongodb');
const fs = require('fs');
// ###################################
// ###### Variable declarations ######
// ###################################
let timeout = (process.env.TIMEOUT || configuration.getProperty('timeout'));
let dbType = process.env.DB_TYPE || configuration.getProperty('db.type');
let dbUrl;
let dbUser;
let dbPassword;
let dbName;
let dbCollection;
let replicaSet;
let uri;
// Read the certificate authority
var ca = [fs.readFileSync(process.cwd() + "/tls/ibmcloud-mongodb")];
// Declare Mongo Client with connection options
const MongoClient = mongodb.MongoClient;
const mongodbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: timeout
};
const mongodbSslOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: timeout,
    tlsAllowInvalidCertificates: true,
    ssl: true,
    sslValidate:true,
    checkServerIdentity:false,
    sslCA: ca
}
// #######################
// ###### Functions ######
// #######################
function initConfig() {
    logger.info("restaurantDao.initConfig called ...");
    const dbSecret = process.env.DB_SECRET;
    logger.info("restaurantDao.initConfig - process.env.DB_SECRET = " + dbSecret);
    if (dbSecret != undefined) {
        // Get database connection configuration from a Secret
        logger.info("restaurantDao.initConfig - parsing secret for Database connection configuration ... ");
        const mongodb = JSON.parse(dbSecret).connection.mongodb;
        //logger.debug("######## restaurantDao.initConfig - mongodb = " + JSON.stringify(mongodb));
        uri = JSON.stringify(mongodb.composed[0]);
        //logger.debug("######## restaurantDao.initConfig - uri (parsed from secret) = " + uri);
    } else { 
        // No Secret found, get database connection configuration from environment variables
        // If no environment variables are defined, try get database connection configuration from config file
        dbUrl = process.env.DB_URL || configuration.getProperty('db.url');
        //replicaSet = process.env.DB_REPLICASET || configuration.getProperty('db.replicaset');
        dbUser = process.env.DB_USER || configuration.getProperty('db.user');
        dbPassword = process.env.DB_PASSWORD || configuration.getProperty('db.password');
        dbName = process.env.DB_NAME || configuration.getProperty('db.name');
        uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/" + dbName + "?retryWrites=true&w=majority";
        //uri = "mongodb://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/?replicaSet=" + replicaSet + "&ssl=true";
    }
    dbCollection = process.env.DB_COLLECTION || configuration.getProperty('db.collection');
}

function findAll(callback) {
    switch (dbType) {
        case "mongodb":
            __findAllMongoDb(callback)
            break;
        default:
            __fakeFindAll(callback);
            break;
    }
}

function create(inputData, callback) {
    initConfig();
    logger.debug("######## restaurantDao.create called and connecting to MongoDb with the following parameters:");
    logger.debug("########      MongoDB URL = " + dbUrl);
    logger.debug("########      MongoDB Username = " + dbUser);
    logger.debug("########      MongoDB Database = " + dbName);
    const client = new MongoClient(uri, mongodbOptions);
    client.connect(err => {
        logger.info("######## Connecting ...");
        const collection = client.db(dbName).collection(dbCollection);
        // perform insert action on the collection object
        var restaurant = {name : inputData.name, city : inputData.city, cuisine : inputData.cuisine, address: {street : inputData.street, zipcode : inputData.zipcode}};
        logger.info("######## Restaurant (stringified) " + JSON.stringify(restaurant));
        logger.info("######## Inserting into " + dbCollection + " collection ...");
        collection.insertOne(restaurant, function(error, result) {
            if (error) {
                logger.error("" + error);
            } else {
                logger.info("######## 1 document inserted ...");
            }
            client.close();
            callback(result, error);
        });
    });
}

function removeById(id, callback) {
    initConfig();
    logger.debug("######## restaurantDao.removeById called and connecting to MongoDb with the following parameters:");
    logger.debug("########      MongoDB URL = " + dbUrl);
    logger.debug("########      MongoDB Username = " + dbUser);
    logger.debug("########      MongoDB Database = " + dbName);
    const client = new MongoClient(uri, mongodbOptions);
    client.connect(err => {
        logger.info("######## Connecting ...");
        const collection = client.db(dbName).collection(dbCollection);
        // perform delete by id action on the collection object
        logger.info("######## Deleting object with id = " + id + " from collection " + collection + " ...");
        var query = { _id: new mongodb.ObjectID(id) };
        collection.deleteOne(query, function(error, result) {
            if (error) {
                logger.error("" + error);
            } else {
                logger.info("######## 1 document deleted ...");
            }
            client.close();
            callback(result, error);
        });
    });
}

// ################### MongoDb Data Access - START
function __findAllMongoDb(callback) {
	initConfig();
    logger.debug("restaurantDao.findAll called and connecting to MongoDb with the following parameters:");
    logger.debug("      MongoDB URL = " + dbUrl);
    logger.debug("      MongoDB Username = " + dbUser);
    logger.debug("      MongoDB Database = " + dbName);
    const client = new MongoClient(uri, mongodbOptions);
    client.connect(err => {
        logger.info("Connecting ...");
        const collection = client.db(dbName).collection(dbCollection);
        // perform find action on the collection object
        logger.info("Querying collection " + collection + " ...");
        collection.find().toArray(function(error, result) {
            if (error) {
                logger.error("" + error);
            } else {
                logger.info("Query executed ...");
            }
            client.close();
            callback(result, error);
        });
    });
}
// ################### MongoDb Data Access - END
// =================== Fake Data Access - START
function __fakeFindAll(callback) {
    logger.debug("######## restaurantDao.findAll called, returning fake list ...");
	var restaurant1 = { id : 1, name : "Hostaria Vecchio Portico", city : "Arona", rating: 4};
	var restaurant2 = { id : 2, name : "Il Ragazzo di Campagna", city : "Gallarate", rating: 4}
	var restaurant3 = { id : 3, name : "Il Cormorano", city : "Milano", rating: 3}
	var restaurant4 = { id : 4, name : "Roadhouse", city : "Varese", rating: 3}
	var restaurant5 = { id : 5, name : "Arancioamaro", city : "Cannero", rating: 3}
	var restaurants = [restaurant1, restaurant2, restaurant3, restaurant4, restaurant5];
	callback({ restaurants : restaurants});
}
// =================== Fake Data Access - START
// ################### Exposed APIs
exports.findAll = findAll;
exports.create = create;
exports.removeById = removeById;