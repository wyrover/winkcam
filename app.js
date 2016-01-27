//////////////////////////////////////////////////////////
/*

Main Execution

Note:
In order to get this app to run, you'll need to get an Instagram Access Token and also
an API key for Microsoft Project Oxford: https://www.npmjs.com/package/project-oxford

*/
//////////////////////////////////////////////////////////
//Requires

//PhotoBooth
var winkcam = require('./winkcam.js');
var photoBooth = winkcam.photoBooth;

//Instagram
var instagram = require('./instagram-node.js');
var getInstagramImageData = instagram.getInstagramImageData;

//MongoDB
var mongo = require('./mongo.js');
var saveToMongoDB = mongo.saveToMongoDB;

//////////////////////////////////////////////////////////
//Main Chain
var tagToSearchFor = "family";

getInstagramImageData(tagToSearchFor)
	.then(function(data){
		return photoBooth(data);
	})
	// .then(function(data){
	// 	return saveToMongoDB(data); //only if you want to save the record to a MongoDB database
	// })
	.catch(console.error.bind(console))
