// Module initialization
const configuration = require('../utils/configuration');
const mongodb = require('mongodb');
const fs = require('fs');
// Variable declarations
let dbUrl // = process.env.DB_URL || configuration.getProperty('db.url');
let dbUser // = process.env.DB_USER || configuration.getProperty('db.user');
let dbPassword //= process.env.DB_PASSWORD || configuration.getProperty('db.password');
let dbName //= process.env.DB_NAME || configuration.getProperty('db.name');
let collection //= process.env.DB_COLLECTION || configuration.getProperty('db.collection');
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
    console.log("######## RestaurantDao.initConfig called ...");
    //dbSecret = process.env.DB_SECRET || configuration.getProperty('db.secret');
    const dbSecret = process.env.DB_SECRET;
    console.log("######## RestaurantDao.initConfig - process.env.DB_SECRET = " + dbSecret);
    console.log("######## RestaurantDao.initConfig - process.env.DB_URL = " + process.env.DB_URL);
    console.log("######## RestaurantDao.initConfig - process.env.DB_USER = " + process.env.DB_USER);
    console.log("######## RestaurantDao.initConfig - process.env.DB_PASSWORD = " + process.env.DB_PASSWORD);
    console.log("######## RestaurantDao.initConfig - process.env.DB_NAME = " + process.env.DB_NAME);
    console.log("######## RestaurantDao.initConfig - process.env.DB_COLLECTION = " + process.env.DB_COLLECTION);
    if (false) {
        console.log("######## RestaurantDao.initConfig - reading configuration from secret ... ");
    } else {
        dbUrl = process.env.DB_URL || configuration.getProperty('db.url');
        dbUser = process.env.DB_USER || configuration.getProperty('db.user');
        dbPassword = process.env.DB_PASSWORD || configuration.getProperty('db.password');
        dbName = process.env.DB_NAME || configuration.getProperty('db.name');
        collection = process.env.DB_COLLECTION || configuration.getProperty('db.collection');
        uri = "mongodb://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/?replicaSet=replset&ssl=true";
    }
    console.log("######## RestaurantDao.config called and connecting to uri " + uri + " ...");
}
function findAll(callback) {
    initConfig();
    console.log("######## RestaurantDao.findAll called and connecting to uri " + uri + "...");
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        console.log("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        console.log("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);  
        const query = { city: 'Arona' };
        console.log("######## Querying collection " + collection + " ...");
        dbo.collection(collection).find(query).toArray(function(err, result) {
            if (err) 
                throw err;
            console.log("######## Query executed ...");
            callback(result);
            db.close();
        });
    });
}

function create(inputData, callback) {
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        console.log("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        console.log("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);          
        console.log("######## Insert into collection " + collection + " ...");
        var restaurant = {name : inputData.name, city : inputData.city, cuisine : inputData.cuisine, address: {street : inputData.street, zipcode : inputData.zipcode}};
        console.log("######## Restaurant (stringified) " + JSON.stringify(restaurant));
        dbo.collection(collection).insertOne(restaurant, function(err, result) {
            if (err) 
                throw err;
            console.log("######## 1 document inserted ...");
            callback(result);
            db.close();
        });
    });
}

function removeById(id, callback) {
    MongoClient.connect(uri, mongodbOptions, function(err, db) {
        console.log("######## Connecting to uri " + uri + "...");
        if (err) 
            throw err;
        console.log("######## Connecting db " + dbName + " ...");
        var dbo = db.db(dbName);          
        console.log("######## Delete object with id = " + id + " from collection " + collection + " ...");
        var query = { _id: new mongodb.ObjectID(id) };
        dbo.collection(collection).deleteOne(query, function(err, result) {
            if (err) 
                throw err;
            console.log("######## 1 document deleted ...");
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
        console.log(movie);
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