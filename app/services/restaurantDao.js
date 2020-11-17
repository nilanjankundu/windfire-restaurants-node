// Module initialization
const configuration = require('../utils/configuration');
const mongodb = require('mongodb');
const fs = require('fs');
var logger = require('../utils/logger');
// Variable declarations
let dbUrl;
let dbUser;
let dbPassword;
let dbName;
let collection;
let replicaSet;
let uri;
// Read the certificate authority
var ca = [fs.readFileSync(process.cwd() + "/tls/ibmcloud-mongodb")];
// Declare Mongo Client with connection options
const MongoClient = mongodb.MongoClient;
const mongodbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true,
    replSet: { 
        ssl: true,
        sslValidate:true,
        checkServerIdentity:false,
        sslCA: ca
    }
}

function initConfig() {
    logger.info("######## RestaurantDao.initConfig called ...");
    const dbSecret = process.env.DB_SECRET;
    logger.info("######## RestaurantDao.initConfig - process.env.DB_SECRET = " + dbSecret);
    if (dbSecret != undefined) {
        // Get database connection configuration from a Secret
        logger.info("######## RestaurantDao.initConfig - parsing secret for Database connection configuration ... ");
        const mongodb = JSON.parse(dbSecret).connection.mongodb;
        logger.debug("######## RestaurantDao.initConfig - mongodb = " + JSON.stringify(mongodb));
        uri = JSON.stringify(mongodb.composed[0]);
        logger.debug("######## RestaurantDao.initConfig - uri (parsed from secret) = " + uri);
    } else { 
        // No Secret found, get database connection configuration from environment variables
        // If no environment variables are defined, try get database connection configuration from config file
        dbUrl = process.env.DB_URL || configuration.getProperty('db.url');
        replicaSet = process.env.DB_REPLICASET || configuration.getProperty('db.replicaset');
        dbUser = process.env.DB_USER || configuration.getProperty('db.user');
        dbPassword = process.env.DB_PASSWORD || configuration.getProperty('db.password');
        uri = "mongodb://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/?replicaSet=" + replicaSet + "&ssl=true";
    }
    dbName = process.env.DB_NAME || configuration.getProperty('db.name');
    collection = process.env.DB_COLLECTION || configuration.getProperty('db.collection');
    logger.debug("######## RestaurantDao.config called, will connect to uri " + uri + " ...");
}
function findAll(callback) {
    initConfig();
    logger.debug("######## RestaurantDao.findAll called and connecting to uri " + uri + " ...");
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        logger.info("######## Connecting ...");
        if (err) 
            throw err;
        logger.info("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);  
        logger.info("######## Querying collection " + collection + " ...");
        dbo.collection(collection).find().toArray(function(err, result) {
            if (err) 
                throw err;
            logger.info("######## Query executed ...");
            callback(result);
            db.close();
        });
    });
}

function create(inputData, callback) {
    initConfig();
    logger.debug("######## RestaurantDao.create called and connecting to uri " + uri + " ...");
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        logger.info("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        logger.info("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);          
        logger.info("######## Insert into collection " + collection + " ...");
        var restaurant = {name : inputData.name, city : inputData.city, cuisine : inputData.cuisine, address: {street : inputData.street, zipcode : inputData.zipcode}};
        logger.info("######## Restaurant (stringified) " + JSON.stringify(restaurant));
        dbo.collection(collection).insertOne(restaurant, function(err, result) {
            if (err) 
                throw err;
            logger.info("######## 1 document inserted ...");
            callback(result);
            db.close();
        });
    });
}

function removeById(id, callback) {
    initConfig();
    logger.debug("######## RestaurantDao.removeById called and connecting to uri " + uri + " ...");
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        logger.info("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        logger.info("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);          
        logger.info("######## Delete object with id = " + id + " from collection " + collection + " ...");
        var query = { _id: new mongodb.ObjectID(id) };
        dbo.collection(collection).deleteOne(query, function(err, result) {
            if (err) 
                throw err;
            logger.info("######## 1 document deleted ...");
            callback(result);
            db.close();
        });
    });
}

exports.findAll = findAll;
exports.create = create;
exports.removeById = removeById;