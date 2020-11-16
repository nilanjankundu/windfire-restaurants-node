// Module initialization
const configuration = require('../utils/configuration');
const mongodb = require('mongodb');
const fs = require('fs');
var logger = require('../utils/logger');
// Variable declarations
let dbUrl // = process.env.DB_URL || configuration.getProperty('db.url');
let dbUser // = process.env.DB_USER || configuration.getProperty('db.user');
let dbPassword //= process.env.DB_PASSWORD || configuration.getProperty('db.password');
let dbName //= process.env.DB_NAME || configuration.getProperty('db.name');
let collection //= process.env.DB_COLLECTION || configuration.getProperty('db.collection');
let replicaSet //= process.env.DB_COLLECTION || configuration.getProperty('db.collection');
let uri //= "mongodb://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/?replicaSet=replset&ssl=true";
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
        /*const env = JSON.parse(dbSecret);
        logger.info("######## RestaurantDao.initConfig - env = " + JSON.stringify(env));*/
        /*const connection = env.connection;
        logger.info("######## RestaurantDao.initConfig - connection = " + JSON.stringify(connection));*/
        const mongodb = JSON.parse(dbSecret).connection.mongodb;
        //const authentication = mongodb.authentication;
        logger.info("######## RestaurantDao.initConfig - mongodb = " + JSON.stringify(mongodb));
        //const uriObj = mongodb.composed[0];
        uri = JSON.stringify(mongodb.composed[0]);
        logger.info("######## RestaurantDao.initConfig - uri (parsed from secret) = " + uri);
        /*const hosts = mongodb.hosts;
        dbUrl = hosts[0].hostname + ":" + hosts[0].port;
        logger.info("######## RestaurantDao.initConfig - dbUrl = " + dbUrl);
        dbUser = authentication.username;
        logger.info("######## RestaurantDao.initConfig - dbUser = " + dbUser);
        dbPassword = authentication.password;
        logger.info("######## RestaurantDao.initConfig - dbPassword = " + dbPassword);*/
        /*replicaSet = mongodb.replica_set;
        logger.info("######## RestaurantDao.initConfig - replicaSet = " + replicaSet);*/
        // parse service binding
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
    logger.info("######## RestaurantDao.config called, will connect to uri " + uri + " ...");
}
function findAll(callback) {
    initConfig();
    logger.info("######## RestaurantDao.findAll called and connecting to uri " + uri + "...");
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        logger.info("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        logger.info("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);  
        const query = { city: 'Arona' };
        logger.info("######## Querying collection " + collection + " ...");
        dbo.collection(collection).find(query).toArray(function(err, result) {
            if (err) 
                throw err;
            logger.info("######## Query executed ...");
            callback(result);
            db.close();
        });
    });
}

function create(inputData, callback) {
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

async function queryAsync() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('sample_mflix');
        const collection = database.collection('movies');
        // Query for a movie that has the title 'Back to the Future'
        const query = { title: 'Back to the Future' };
        const movie = await collection.findOne(query);
        //const movie = await collection.find();
        logger.info(movie);
        //return movie
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

//run().catch(console.dir);

exports.findAll = findAll;
exports.create = create;
exports.removeById = removeById;
//exports.queryAsync = queryAsync;