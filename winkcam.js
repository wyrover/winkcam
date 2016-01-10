//////////////////////////////////////////////////////////
/*
WinkCam
*/
//////////////////////////////////////////////////////////
//Setup
var isOutlineFace = false;

var imageOutput = __dirname + '/image5.png'

var faceImgFile = '/Users/davidlung/Documents/winkcam/dude.png'
var itemImgFile = '/Users/davidlung/Documents/winkcam/hat_cowboy.png'

var instagramRes = 1080

//////////////////////////////////////////////////////////
//Requires
var oxford = require('project-oxford');
var client = new oxford.Client('3e870f9217264499bba3b709ae11b05c');

var Canvas = require('canvas');
var Image = Canvas.Image;
//ctx reference: http://www.w3schools.com/tags/ref_canvas.asp

var http = require('http');
var fs = require('fs')

//////////////////////////////////////////////////////////

function faceDetect(){

	return new Promise(function(resolve, reject) {

		client.face.detect({
		    path: faceImgFile,
		    returnFaceId: true,
		    analyzesFaceLandmarks: true
		}).then(function (response) {
			//console.log(faces[0].faceLandmarks.noseTip)
			console.log(response);
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

			fs.readFile(itemImgFile, function(err, image2buffer){
				if (err) throw err;
				var img2 = new Image;
				img2.src = image2buffer;

				//Item Factors
				var scaleFactor = 1.8; //Scale up/down the item size
				var yFactor = 0.9; //Move item up/down a bit along vertical axis of face
				
				//Face Outline
				for (var i=0; i<faces.length; i++){

					//face
					var canvasFacefactor = canvas.width/img1.width //Face image must be a square

					var faceX = faces[i].faceRectangle.left*canvasFacefactor;
					var faceY = faces[i].faceRectangle.top*canvasFacefactor;
					var faceW = faces[i].faceRectangle.width*canvasFacefactor;
					var faceH = faces[i].faceRectangle.height*canvasFacefactor;

					var faceCenterX = faceX + faceW/2
					var faceCenterY = faceY + faceH/2

					var leftEye = faces[i].faceLandmarks.pupilLeft;
					var rightEye = faces[i].faceLandmarks.pupilRight;

					var angleOfEyesRadians = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
					var angleOfEyesDeg = angleOfEyesRadians * 180 / Math.PI;

					if (isOutlineFace){
						ctx.lineWidth=3;
						ctx.strokeStyle="#FF0000";
						ctx.strokeRect(faceX, faceY, faceW, faceH);
					};

					//Item Scale proportionally to face width
					var itemW = img2.width*faceW/img2.width*scaleFactor;
					var itemH = img2.height*faceW/img2.width*scaleFactor;
					
					//Item rotate and translate
					ctx.translate(faceCenterX, faceCenterY); 	//change context reference point to center so we can rotate about the center point
					ctx.rotate(angleOfEyesRadians); 			//Rotate item so it aligns with face axis
					ctx.translate(0,-faceH*yFactor); 			//Translate Item (note: we don't need to do anything with x b/c we rotated it so the item is relative to the new rotated axis!)
					ctx.translate(-faceCenterX, -faceCenterY); 	//change back context reference point

					//Draw Item
					ctx.drawImage(img2,
						faceX-(itemW/2-faceW/2),  	//x = faceX - dx
						faceY-(itemH/2-faceH/2), 	//y = faceY - dy
						itemW, 						//itemW
						itemH						//itemH
					);

					//Reset All Transformations
					ctx.setTransform(1, 0, 0, 1, 0, 0); //http://www.w3schools.com/tags/canvas_settransform.asp

					//Output Image file
					if (i==(faces.length-1)){
						var dataUrl = canvas.toDataURL(); //encoded image data
						resolve(dataUrl);
					};

				};
				
			});
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
faceDetect()
	.then(function(faces){
		return augmentFace(faces)		
	})
	.then(function(imgData){
		saveImage(imgData)		
	})












