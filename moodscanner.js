//////////////////////////////////////////////////////////
/*
Mood Scanner
XXXX is feeling...

Try it yourself by tagging us @moodscanner in your selfie photo!
*/
//////////////////////////////////////////////////////////
//Setup
var imageOutput = '/Users/davidlung/Pictures' + '/mood4.png'
var faceImgFile = '/Users/davidlung/Documents/winkcam/sophydance.jpg'
var instagramRes = 1080

//////////////////////////////////////////////////////////
//Requires
var oxford = require('project-oxford');
var client = new oxford.Client('72a65f18115c46d98c2b416c6f3330ce');

var Canvas = require('canvas');
var Image = Canvas.Image;
//ctx reference: http://www.w3schools.com/tags/ref_canvas.asp

var http = require('http');
var fs = require('fs')

//////////////////////////////////////////////////////////

function emotionDetect(){

	return new Promise(function(resolve, reject) {

		client.emotion.analyzeEmotion({
		    path: faceImgFile,
		    returnFaceId: true
		}).then(function (response) {
			//console.log(response);
			resolve(response);
		});

	})

}

//////////////////////////////////////////////////////////

function augmentFace(faces){

	return new Promise(function(resolve, reject) {

		fs.readFile(faceImgFile, function(err, image1buffer){
			if (err) throw err;
			var img1 = new Image;
			img1.src = image1buffer;

			var canvas = new Canvas(instagramRes, instagramRes);
			var ctx = canvas.getContext('2d');

			//Face Image
			ctx.drawImage(img1, 0, 0, img1.width,    img1.height,    // source rectangle
                   			0, 0, canvas.width, canvas.height)  // destination rectangle

			//Face Outline
			for (var i=0; i<faces.length; i++){

				//emotions
				var anger = faces[i].scores.anger*100
				var contempt = faces[i].scores.contempt*100
				var disgust = faces[i].scores.disgust*100
				var fear = faces[i].scores.fear*100
				var happiness = faces[i].scores.happiness*100
				var neutral = faces[i].scores.neutral*100
				var sadness = faces[i].scores.sadness*100
				var surprise = faces[i].scores.surprise*100

				//face
				var canvasFacefactor = canvas.width/img1.width //Face image must be a square

				var faceX = faces[i].faceRectangle.left*canvasFacefactor;
				var faceY = faces[i].faceRectangle.top*canvasFacefactor;
				var faceW = faces[i].faceRectangle.width*canvasFacefactor;
				var faceH = faces[i].faceRectangle.height*canvasFacefactor;

				var faceCenterX = faceX + faceW/2
				var faceCenterY = faceY + faceH/2

				//Outline Face
				ctx.lineWidth=6;
				ctx.strokeStyle="#FF0000";
				ctx.strokeRect(faceX, faceY, faceW, faceH);

				//Text
				ctx.font="20px arial";
				//ctx.textAlign="end";
				ctx.fillStyle="#FF0000";

				var yh = 0;
				var thresholdPercent = 1;
				if (anger>thresholdPercent){yh=yh+20;ctx.fillText("anger: " + String(anger).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("anger: " + String(anger).split('.')[0] + "%")}
				if (contempt>thresholdPercent){yh=yh+20;ctx.fillText("contempt: " + String(contempt).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("contempt: " + String(contempt).split('.')[0] + "%")}
				if (disgust>thresholdPercent){yh=yh+20;ctx.fillText("disgust: " + String(disgust).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("disgust: " + String(disgust).split('.')[0] + "%")}
				if (fear>thresholdPercent){yh=yh+20;ctx.fillText("fear: " + String(fear).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("fear: " + String(fear).split('.')[0] + "%")}
				if (happiness>thresholdPercent){yh=yh+20;ctx.fillText("happiness: " + String(happiness).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("happiness: " + String(happiness).split('.')[0] + "%")}
				if (neutral>thresholdPercent){yh=yh+20;ctx.fillText("neutral: " + String(neutral).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("neutral: " + String(neutral).split('.')[0] + "%")}
				if (sadness>thresholdPercent){yh=yh+20;ctx.fillText("sadness: " + String(sadness).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("sadness: " + String(sadness).split('.')[0] + "%")}
				if (surprise>thresholdPercent){yh=yh+20;ctx.fillText("surprise: " + String(surprise).split('.')[0] + "%",faceX,faceY+faceH+yh);console.log("surprise: " + String(surprise).split('.')[0] + "%")}
				

				//Output Image file
				if (i==(faces.length-1)){
					var dataUrl = canvas.toDataURL(); //encoded image data
					resolve(dataUrl);
				};

			};

		});

	});
};

function saveImage(dataUrl){
	// strip off the data: url prefix to get just the base64-encoded bytes
	var data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64'); //decode the base64 data
	fs.writeFile(imageOutput, buf);
};

//////////////////////////////////////////////////////////
emotionDetect()
	.then(function(faces){
		return augmentFace(faces)		
	})
	.then(function(imgData){
		saveImage(imgData)		
	})












