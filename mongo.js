////////////////////////////////////////////
//Setup

//Make sure to run mongod: mongod is the primary daemon process for the MongoDB system. The server.
//https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

//Make sure you to import an existing dataset for this example:
//https://docs.mongodb.org/getting-started/node/import-data/

module.exports = (function(){
   //////////////////////////////////////////////////////
   //Requires
   var assert = require('assert');
   var mongodb = require('/usr/local/lib/node_modules/mongodb'); //lets require/import the mongodb native drivers.

   //We need to work with "MongoClient" interface in order to connect to a mongodb server.
   var MongoClient = mongodb.MongoClient;

   //Connection URL. This is where your mongodb server is running.
   var url = 'mongodb://username:password@#####.mongolab.com:#####/heroku_XXXXXXXXXX';

   //////////////////////////////////////////////////////
   //Create
   //Put Data into a MongoDB Server: https://docs.mongodb.org/getting-started/node/insert/
   //You can use the insertOne method and the insertMany method to add documents to a collection in MongoDB. If you attempt to add documents to a collection that does not exist, MongoDB will create the collection for you.
   //If the document passed to the insertOne method does not contain the _id field, the driver automatically adds the field to the document and sets the field’s value to a generated ObjectId.
   //In MongoDB, documents stored in a collection must have a unique _id field that acts as a primary key.

    function _insertInstagramRecord(dataRecord, db, callback) {
        db.collection('InstagramCollection').insertOne(
            dataRecord,
            function(err, result) {
                assert.equal(err, null);
                console.log("Inserted the instagram document record into the collection: InstagramCollection");
                callback(result);
            }
        );
    };

   //////////////////////////////////////////////////////
   //Execute Find
    function saveToMongoDB(instagramRecord){
        console.log("Saving to MongoDB...");
        return new Promise(function(resolve,reject){
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                _insertInstagramRecord(instagramRecord, db, function() {
                    db.close();
                    resolve();
                });
            });
        });
    }
   //////////////////////////////////////////////////////////
   //We define what we want to expose here: our API
    return {
        saveToMongoDB: saveToMongoDB
    };

})();





















