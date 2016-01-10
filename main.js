//////////////////////////////////////////////////////////
/*
Main Execution
*/
//////////////////////////////////////////////////////////
//Setup



//////////////////////////////////////////////////////////
//Requires
var winkcam = require('./winkcam4.js');
var photoBooth = winkcam.photoBooth;

var instagram = require('./instagram-node.js');
var getInstagramImageData = instagram.getInstagramImageData;

var igerslikeUploadImage = require('./igerslikeUploadImage.js');
var igerslikeHorseman = igerslikeUploadImage.igerslikeHorseman;

//////////////////////////////////////////////////////////
//Main Execute
getInstagramImageData()
	.then(function(data){
		return photoBooth(data);
	})
	.then(function(data){
		var instagramCaption = '@' + data.user.username + ' !';
		return igerslikeHorseman(instagramCaption);
	})
	.catch(console.error.bind(console))


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//Post on Igerslike only
// var instagramCaption = '@ggkongg ! Try it yourself now by tagging your photo with #laughingbooth';
// igerslikeHorseman(instagramCaption)