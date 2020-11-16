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
    console.log("######## RestaurantDao.initConfig called ...");
    const dbSecret = process.env.DB_SECRET;
    console.log("######## RestaurantDao.initConfig - process.env.DB_SECRET = " + dbSecret);
    if (dbSecret != undefined) {
        // Get database connection configuration from a Secret
        console.log("######## RestaurantDao.initConfig - parsing secret for Database connection configuration ... ");
        const env = JSON.parse(dbSecret);
        console.log("######## RestaurantDao.initConfig - env = " + JSON.stringify(env));
        const connection = env.connection;
        console.log("######## RestaurantDao.initConfig - connection = " + JSON.stringify(connection));
        const mongodb = connection.mongodb;
        console.log("######## RestaurantDao.initConfig - mongodb = " + JSON.stringify(mongodb));
        const uriObj = mongodb.composed[0];
        const uriParsed = JSON.stringify(uriObj);
        console.log("######## RestaurantDao.initConfig - uri (parsed from secret) = " + uriParsed);
        // mongodb://ibm_cloud_14b30c86_fa14_4362_8ee5_6ffe7fbc2535:5fba5aa7ba1b3fe9c7d3605d1748ee073a71396717b49bab368ed7e95844f3f3@b70bf512-88b2-45ef-a63c-80970b486146-0.659dc287bad647f9b4fe17c4e4c38dcc.databases.appdomain.cloud:31554,b70bf512-88b2-45ef-a63c-80970b486146-1.659dc287bad647f9b4fe17c4e4c38dcc.databases.appdomain.cloud:31554,b70bf512-88b2-45ef-a63c-80970b486146-2.659dc287bad647f9b4fe17c4e4c38dcc.databases.appdomain.cloud:31554/ibmclouddb?authSource=admin&replicaSet=replset
        const authentication = mongodb.authentication;
        const hosts = mongodb.hosts;
        dbUrl = hosts[0].hostname + ":" + hosts[0].port;
        dbUser = authentication.username;
        dbPassword = authentication.password;
        replicaSet = mongodb.replica_set;
        // parse service binding
    } else { 
        // No Secret found, get database connection configuration from environment variables
        // If no environment variables are defined, try get database connection configuration from config file
        dbUrl = process.env.DB_URL || configuration.getProperty('db.url');
        dbUser = process.env.DB_USER || configuration.getProperty('db.user');
        dbPassword = process.env.DB_PASSWORD || configuration.getProperty('db.password');
        dbName = process.env.DB_NAME || configuration.getProperty('db.name');
        collection = process.env.DB_COLLECTION || configuration.getProperty('db.collection');
        replicaSet = "replset";
    }
    uri = "mongodb://" + dbUser + ":" + dbPassword + "@" + dbUrl + "/?replicaSet=" + replica_set + "&ssl=true";
    console.log("######## RestaurantDao.config called, will connect to uri " + uri + " ...");
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