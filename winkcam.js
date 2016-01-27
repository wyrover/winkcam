//////////////////////////////////////////////////////////
/*
WinkCam v4
Url Stream
*/
//////////////////////////////////////////////////////////

module.exports = (function(){

	//////////////////////////////////////////////////////////
	//Setup
	var isOutlineFace = false;

	var imageOutput = __dirname + '/instagramPost.jpg'; //main saved photoboothed image file
	var faceImgUrl = '';

	var faceImgFile = __dirname + '/instagramPre.png'; //name of raw image saved from url
	var itemList = require(__dirname + "/items.js"); //database of props

	var instagramRes = 640; //resolution of imageOutput.

	var propProbability = {
		//Chance of wearing a prop: 0.1 = 10% chance
		eyebrows: 1,
		glasses: 1,
		hats: 1,
		beard: 1,
		mouth: 1,
		mustache: 1,
		noses: 1
	};

	//////////////////////////////////////////////////////////
	//Requires
	var async = require('async');
	var oxford = require('project-oxford');
	var client = new oxford.Client('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
	//Need to obtain API key for Microsoft Project Oxford: https://www.npmjs.com/package/project-oxford

	var Canvas = require('canvas'); //ctx reference: http://www.w3schools.com/tags/ref_canvas.asp
	var Image = Canvas.Image;
	var canvas = new Canvas(instagramRes, instagramRes);
	var ctx = canvas.getContext('2d');

	var fs = require('fs');
	var request = require('request');

	//Variables
	var recordNum = 0;
	var canvasFacefactor;
	var faceImg;

	//////////////////////////////////////////////////////////
	//Face Variables
	var faceX = [];
	var faceY = [];
	var faceW = [];
	var faceH = [];

	var faceCenterX = [];
	var faceCenterY = [];

	//Eyebrows
	var eyebrowLeftOuter = [];
	var eyebrowLeftInner = [];
	var browLeftAngle = [];
	var browLeftW = [];
	var eyebrowLeftCenter = [];

	var eyebrowRightOuter = [];
	var eyebrowRightInner = [];
	var browRightAngle = [];
	var browRightW = [];
	var eyebrowRightCenter = [];

	//Eyes
	var eyeLeftTop = [];
	var eyeLeftBottom = [];
	var eyeRightTop = [];
	var eyeRightBottom = [];
	var leftEye = [];
	var rightEye = [];
	var distEyes = [];

	var angleOfEyesRadians = [];
	var angleOfEyesDeg = [];

	//Nose
	var noseTip = [];
	var noseLeftAlarOutTip = [];
	var noseRightAlarOutTip = [];
	var noseWidth = [];

	//Mustache
	var mustacheCenter = [];

	//Mouth
	var mouthLeft = [];
	var mouthRight = [];
	var upperLipTop = [];
	var underLipBottom = [];
	var mouthWidth = [];
	var mouthCenter = [];
	
	//////////////////////////////////////////////////////////
	//Main Execute
	function photoBooth(data){

		instagramData = data;
		faceImgUrl = instagramData[recordNum].images.standard_resolution.url;

		console.log("Instagram record #" + (recordNum+1));
    	console.log("     Instagram link: " + instagramData[recordNum].link);
    	console.log("     Username: @" + instagramData[recordNum].user.username);
    	console.log("     Media type: " + instagramData[recordNum].type);
    	console.log("     Image id: " + instagramData[recordNum].id);
    	console.log("     Image url: " + instagramData[recordNum].images.standard_resolution.url);

		return _downloadImage()
			.then(function(){ return _mainFaceImage();})
			.then(function(){ return _faceDetect();})

			.then(function(faces){ return _faceCalculations(faces);})
			.then(function(faces){ return _outlineFaces(faces);})

			.then(function(faces){ return _eyebrows(faces);})
			.then(function(faces){ return _glasses(faces);})
			.then(function(faces){ return _hats(faces);})
			.then(function(faces){ return _beard(faces);})
			.then(function(faces){ return _mouth(faces);})
			.then(function(faces){ return _mustache(faces);})
			.then(function(faces){ return _noses(faces);})

			.then(function(faces){ return _saveImage();})

			//Restart photoBooth if something didn't work above
			.then(null, function(rejectedPromise){ return _restartChain(rejectedPromise);})
	}
	
	//////////////////////////////////////////////////////////
	function _restartChain(rejectedPromise){
		recordNum++;
		if (recordNum<instagramData.length){ //There are always 20 instagram records that are retrived
			console.log("Trying next instagram record...\n");
			return photoBooth(instagramData);
		} else {
			return Promise.reject(rejectedPromise);
		};
	}

	function _downloadImage(){
		console.log("Downloading image...");
		return new Promise(function(resolve, reject) {

			request.get({url: faceImgUrl, encoding: 'binary'}, function (err, response, body) {
				if (err) {
					console.log("Image download failed!");
					reject(err);
				} else {
					fs.writeFile(faceImgFile, body, 'binary', function(err) {
						if (err) {
							console.log("Image write failed!");
							reject(err);
						} else {
							console.log("Image successfully downloaded!");
							resolve();
						}
					});
				}
			});

		});
	}

	function _faceDetect(){
		console.log("Detecting faces...");
		return new Promise(function(resolve, reject) {
			client.face.detect({
			    path: faceImgFile,
			    analyzesFaceLandmarks: true
			}).then(function (response) {
				//console.log(response);
				if (response.length==0) {
					console.log("Facial Detection didn't work!");
					reject(new Error("Facial Detection didn't work!"));
				} else {
					resolve(response);
				};
			});

		});
	}

	function _mainFaceImage(){
		console.log("Drawing main image...");
		return new Promise(function(resolve, reject) {
			//load Main Face Image
			fs.readFile(faceImgFile, function(err, imagebuffer){
				if (err) throw err;
				faceImg = new Image;
				faceImg.src = imagebuffer;

				//Face Image
				ctx.drawImage(faceImg, 0, 0, faceImg.width,    faceImg.height,    // source rectangle
	                   				0, 0, canvas.width, canvas.height)  // destination rectangle

				resolve()
			});
		});
    }

	function _faceCalculations(faces){
		console.log("Calculating face dimensions...")

		//Distance between two points - added to Math object
		Math.dist=function(x1,y1,x2,y2){ 
		  if(!x2) x2=0; 
		  if(!y2) y2=0;
		  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
		}

		return new Promise(function(resolve, reject) {
			for (var i=0; i<faces.length; i++){
				//Canvas Scale Factor
				canvasFacefactor = canvas.width/faceImg.width //Face image must be a square

				//Face Variables
				faceX.push(faces[i].faceRectangle.left*canvasFacefactor);
				faceY.push(faces[i].faceRectangle.top*canvasFacefactor);
				faceW.push(faces[i].faceRectangle.width*canvasFacefactor);
				faceH.push(faces[i].faceRectangle.height*canvasFacefactor);
				faceCenterX.push(faceX[i] + faceW[i]/2);
				faceCenterY.push(faceY[i] + faceH[i]/2);

				//Eyebrows
				eyebrowLeftOuter.push(faces[i].faceLandmarks.eyebrowLeftOuter);
				eyebrowLeftOuter[i].x=eyebrowLeftOuter[i].x*canvasFacefactor;
				eyebrowLeftOuter[i].y=eyebrowLeftOuter[i].y*canvasFacefactor;
				eyebrowLeftInner.push(faces[i].faceLandmarks.eyebrowLeftInner);
				eyebrowLeftInner[i].x=eyebrowLeftInner[i].x*canvasFacefactor;
				eyebrowLeftInner[i].y=eyebrowLeftInner[i].y*canvasFacefactor;
				eyebrowLeftCenter.push({x:0,y:0});//add eyebrowLeftCenter object
				eyebrowLeftCenter[i].x = eyebrowLeftOuter[i].x/2+eyebrowLeftInner[i].x/2;
				eyebrowLeftCenter[i].y = eyebrowLeftOuter[i].y/2+eyebrowLeftInner[i].y/2;
				browLeftAngle.push(Math.atan2(eyebrowLeftInner[i].y - eyebrowLeftOuter[i].y, eyebrowLeftInner[i].x - eyebrowLeftOuter[i].x));
				browLeftW.push(Math.dist(eyebrowLeftOuter[i].x,eyebrowLeftOuter[i].y,eyebrowLeftInner[i].x,eyebrowLeftInner[i].y));

				eyebrowRightOuter.push(faces[i].faceLandmarks.eyebrowRightOuter);
				eyebrowRightOuter[i].x=eyebrowRightOuter[i].x*canvasFacefactor;
				eyebrowRightOuter[i].y=eyebrowRightOuter[i].y*canvasFacefactor;
				eyebrowRightInner.push(faces[i].faceLandmarks.eyebrowRightInner);
				eyebrowRightInner[i].x=eyebrowRightInner[i].x*canvasFacefactor;
				eyebrowRightInner[i].y=eyebrowRightInner[i].y*canvasFacefactor;
				eyebrowRightCenter.push({x:0,y:0});//add eyebrowRightCenter object
				eyebrowRightCenter[i].x = eyebrowRightOuter[i].x/2+eyebrowRightInner[i].x/2;
				eyebrowRightCenter[i].y = eyebrowRightOuter[i].y/2+eyebrowRightInner[i].y/2;
				browRightAngle.push(Math.atan2(eyebrowRightOuter[i].y - eyebrowRightInner[i].y, eyebrowRightOuter[i].x - eyebrowRightInner[i].x));
				browRightW.push(Math.dist(eyebrowRightOuter[i].x,eyebrowRightOuter[i].y,eyebrowRightInner[i].x,eyebrowRightInner[i].y));

				//Eyes
				eyeLeftTop.push(faces[i].faceLandmarks.eyeLeftTop);
				eyeLeftTop[i].x=eyeLeftTop[i].x*canvasFacefactor;
				eyeLeftTop[i].y=eyeLeftTop[i].y*canvasFacefactor;
				eyeLeftBottom.push(faces[i].faceLandmarks.eyeLeftBottom);
				eyeLeftBottom[i].x=eyeLeftBottom[i].x*canvasFacefactor;
				eyeLeftBottom[i].y=eyeLeftBottom[i].y*canvasFacefactor;
				leftEye.push({x:0,y:0});//add leftEye object
				leftEye[i].x = eyeLeftTop[i].x/2+eyeLeftBottom[i].x/2;
				leftEye[i].y = eyeLeftTop[i].y/2+eyeLeftBottom[i].y/2;

				eyeRightTop.push(faces[i].faceLandmarks.eyeRightTop);
				eyeRightTop[i].x=eyeRightTop[i].x*canvasFacefactor;
				eyeRightTop[i].y=eyeRightTop[i].y*canvasFacefactor;
				eyeRightBottom.push(faces[i].faceLandmarks.eyeRightBottom);
				eyeRightBottom[i].x=eyeRightBottom[i].x*canvasFacefactor;
				eyeRightBottom[i].y=eyeRightBottom[i].y*canvasFacefactor;
				rightEye.push({x:0,y:0});//add rightEye object
				rightEye[i].x = eyeRightTop[i].x/2+eyeRightBottom[i].x/2;
				rightEye[i].y = eyeRightTop[i].y/2+eyeRightBottom[i].y/2;

				distEyes.push(Math.dist(rightEye[i].x,rightEye[i].y,leftEye[i].x,leftEye[i].y));

				angleOfEyesRadians.push(Math.atan2(rightEye[i].y - leftEye[i].y, rightEye[i].x - leftEye[i].x));
				angleOfEyesDeg.push(angleOfEyesRadians[i] * 180 / Math.PI);

				//Nose
				noseTip.push(faces[i].faceLandmarks.noseTip);
				noseTip[i].x=noseTip[i].x*canvasFacefactor;
				noseTip[i].y=noseTip[i].y*canvasFacefactor;
				noseLeftAlarOutTip.push(faces[i].faceLandmarks.noseLeftAlarOutTip);
				noseLeftAlarOutTip[i].x=noseLeftAlarOutTip[i].x*canvasFacefactor;
				noseLeftAlarOutTip[i].y=noseLeftAlarOutTip[i].y*canvasFacefactor;
				noseRightAlarOutTip.push(faces[i].faceLandmarks.noseRightAlarOutTip);
				noseRightAlarOutTip[i].x=noseRightAlarOutTip[i].x*canvasFacefactor;
				noseRightAlarOutTip[i].y=noseRightAlarOutTip[i].y*canvasFacefactor;
				noseWidth.push(Math.dist(noseLeftAlarOutTip[i].x,noseLeftAlarOutTip[i].y,noseRightAlarOutTip[i].x,noseRightAlarOutTip[i].y));

				//Mouth
				mouthLeft.push(faces[i].faceLandmarks.mouthLeft);
				mouthLeft[i].x=mouthLeft[i].x*canvasFacefactor;
				mouthLeft[i].y=mouthLeft[i].y*canvasFacefactor;
				mouthRight.push(faces[i].faceLandmarks.mouthRight);
				mouthRight[i].x=mouthRight[i].x*canvasFacefactor;
				mouthRight[i].y=mouthRight[i].y*canvasFacefactor;

				upperLipTop.push(faces[i].faceLandmarks.upperLipTop);
				upperLipTop[i].x=upperLipTop[i].x*canvasFacefactor;
				upperLipTop[i].y=upperLipTop[i].y*canvasFacefactor;
				underLipBottom.push(faces[i].faceLandmarks.underLipBottom);
				underLipBottom[i].x=underLipBottom[i].x*canvasFacefactor;
				underLipBottom[i].y=underLipBottom[i].y*canvasFacefactor;

				mouthWidth.push(Math.dist(mouthLeft[i].x,mouthLeft[i].y,mouthRight[i].x,mouthRight[i].y));

				mouthCenter.push({x:0,y:0});//add mouthCenter object
				mouthCenter[i].x = upperLipTop[i].x/2+underLipBottom[i].x/2;
				mouthCenter[i].y = upperLipTop[i].y/2+underLipBottom[i].y/2;

				//Mustache
				mustacheCenter.push({x:0,y:0});//add mustacheCenter object
				mustacheCenter[i].x = noseTip[i].x/2+upperLipTop[i].x/2;
				mustacheCenter[i].y = noseTip[i].y/2+upperLipTop[i].y/2;

			};

			resolve(faces);
		});
    }

	function _outlineFaces(faces){
		return new Promise(function(resolve, reject) {

			if (isOutlineFace){
				console.log("Outlining faces..")
				ctx.lineWidth=5;
				ctx.strokeStyle="#FF0000";
				for (var i=0; i<faces.length; i++){
					//face outline
					ctx.strokeRect(faceX[i], faceY[i], faceW[i], faceH[i]);
					//eye centers outline
					ctx.beginPath();
					ctx.lineWidth="5";
					ctx.strokeStyle="red";
					ctx.moveTo(leftEye[i].x, leftEye[i].y);
					ctx.lineTo(rightEye[i].x, rightEye[i].y);
					ctx.stroke();

					ctx.beginPath(); 
					ctx.lineWidth="5";
					ctx.strokeStyle="green"; // Green path
					ctx.moveTo(mouthLeft[i].x, mouthLeft[i].y);
					ctx.lineTo(mouthRight[i].x, mouthRight[i].y);
					ctx.stroke(); // Draw it

					ctx.beginPath(); 
					ctx.lineWidth="5";
					ctx.strokeStyle="green"; // Green path
					ctx.moveTo(upperLipTop[i].x, upperLipTop[i].y);
					ctx.lineTo(underLipBottom[i].x, underLipBottom[i].y);
					ctx.stroke(); // Draw it
				};
			};

			resolve(faces);

		});
    }

    //////////////////////////////////////////////////////////
    function _hats(faces){
    	console.log("Putting on hats...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.hats[Math.floor(Math.random()*itemList.hats.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.hats){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor
						var xFactor = chosenItems[i].xFactor
						var yFactor = chosenItems[i].yFactor

						//Item Scale proportionally to face width
						var itemW = img.width*faceW[i]/img.width*scaleFactor;
						var itemH = img.height*faceW[i]/img.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(faceCenterX[i], faceCenterY[i]); 	//change context reference point to center so we can rotate about the center point
						ctx.rotate(angleOfEyesRadians[i]); 			//Rotate item so it aligns with face axis
						ctx.translate(faceW[i]*xFactor,faceH[i]*yFactor); 			//Translate Item (note: we don't need to do anything with x b/c we rotated it so the item is relative to the new rotated axis!)
						ctx.translate(-faceCenterX[i], -faceCenterY[i]); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img,
							faceX[i]-(itemW/2-faceW[i]/2),  //x = faceX - dx
							faceY[i]-(itemH/2-faceH[i]/2), 	//y = faceY - dy
							itemW, 							//itemW
							itemH							//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); 			//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); //http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});
		});
	}

	function _eyebrows(faces){
    	console.log("Putting on eyebrows...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.eyebrows[Math.floor(Math.random()*itemList.eyebrows.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.eyebrows){
						//Left Eyebrow
						var img1 = new Image;
						img1.src = results[i];
						
						var scaleFactor = chosenItems[i].scaleFactor
						var yFactor = chosenItems[i].yFactor;

						//Item Scale proportionally to mouth width
						var itemW1 = img1.width*browLeftW[i]/img1.width*scaleFactor;
						var itemH1 = img1.height*browLeftW[i]/img1.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(eyebrowLeftCenter[i].x, eyebrowLeftCenter[i].y); 		//change context reference point to center so we can rotate about the center point
						ctx.rotate(browLeftAngle[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(0,faceH[i]*yFactor);
						ctx.translate(-eyebrowLeftCenter[i].x, -eyebrowLeftCenter[i].y); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img1,
							eyebrowLeftCenter[i].x-0.5*itemW1,  	//x = faceX - dx
							eyebrowLeftCenter[i].y-0.5*itemH1, 	//y = faceY - dy
							itemW1, 							//itemW1
							itemH1							//itemH1
						);

						//Reset All Transformations
						ctx.rotate(-browLeftAngle[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp


						////////////////////////////////////////////////////

						//Right Eyebrow
						var img2 = new Image;
						img2.src = results[i];

						//Item Scale proportionally to mouth width
						var itemW2 = img2.width*browRightW[i]/img2.width*scaleFactor;
						var itemH2 = img2.height*browRightW[i]/img2.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(eyebrowRightCenter[i].x, eyebrowRightCenter[i].y); 		//change context reference point to center so we can rotate about the center point
						ctx.rotate(browRightAngle[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(0,faceH[i]*yFactor);
						ctx.scale(-1, 1); //mirror
						ctx.translate(-eyebrowRightCenter[i].x, -eyebrowRightCenter[i].y); 	//change back context reference point

						//Draw Item
						//ctx.fillRect(eyebrowRightCenter[i].x-0.5*itemW2,eyebrowRightCenter[i].y-0.5*itemH2,itemW2,itemH2)
						ctx.drawImage(img2,
							eyebrowRightCenter[i].x-0.5*itemW2,  	//x = faceX - dx
							eyebrowRightCenter[i].y-0.5*itemH2, 	//y = faceY - dy
							itemW2, 								//itemW2
							itemH2									//itemH2
						);

						//Reset All Transformations
						ctx.rotate(-browRightAngle[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});

		});
	}

	function _glasses(faces){
		console.log("Putting on glasses...");
    	return new Promise(function(resolve,reject){

			var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.glasses[Math.floor(Math.random()*itemList.glasses.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

			async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;

				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.glasses){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor

						//Scale glasses to the distance between the eyes
						var itemW = img.width*(2*distEyes[i]/img.width)*scaleFactor;
						var itemH = img.height*(2*distEyes[i]/img.width)*scaleFactor;

						//Coordinates to the point between the eyes
						var middleEyeX = leftEye[i].x/2 + rightEye[i].x/2;
						var middleEyeY = leftEye[i].y/2 + rightEye[i].y/2;

						ctx.translate(middleEyeX, middleEyeY); 		//change context reference point to center so we can rotate glasses about the center point
						ctx.rotate(angleOfEyesRadians[i]); 			//Rotate item so it aligns with face axis
						ctx.translate(-middleEyeX, -middleEyeY); 	//restore translate reference point

						ctx.drawImage(img,
							middleEyeX-0.5*itemW,  	//x
							middleEyeY-0.5*itemH, 	//y
							itemW, 						//itemW
							itemH						//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); //Restore rotate reference point
						ctx.setTransform(1, 0, 0, 1, 0, 0); //http://www.w3schools.com/tags/canvas_settransform.asp
					};
				};
				resolve(faces);
				
			});

		});
    }

    function _noses(faces){
    	console.log("Putting on noses...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.nose[Math.floor(Math.random()*itemList.nose.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.noses){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor
						var yFactor = chosenItems[i].yFactor;

						//Item Scale proportionally to mouth width
						var itemW = img.width*noseWidth[i]/img.width*scaleFactor;
						var itemH = img.height*noseWidth[i]/img.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(noseTip[i].x, noseTip[i].y); 		//change context reference point to center so we can rotate about the center point
						ctx.rotate(angleOfEyesRadians[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(0,faceH[i]*yFactor);
						ctx.translate(-noseTip[i].x, -noseTip[i].y); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img,
							noseTip[i].x-0.5*itemW,  	//x = faceX - dx
							noseTip[i].y-0.5*itemH, 	//y = faceY - dy
							itemW, 							//itemW
							itemH							//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});

		});
	}

    function _mustache(faces){
    	console.log("Putting on mustaches...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.mustache[Math.floor(Math.random()*itemList.mustache.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.mustache){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor;
						var yFactor = chosenItems[i].yFactor;

						//Item Scale proportionally to mouth width
						var itemW = img.width*mouthWidth[i]/img.width*scaleFactor;
						var itemH = img.height*mouthWidth[i]/img.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(mustacheCenter[i].x, mustacheCenter[i].y); 	//change context reference point to center so we can rotate about the center point
						ctx.rotate(angleOfEyesRadians[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(0,faceH[i]*yFactor);
						ctx.translate(-mustacheCenter[i].x, -mustacheCenter[i].y); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img,
							mustacheCenter[i].x-0.5*itemW,  	//x = faceX - dx
							mustacheCenter[i].y-0.5*itemH, 	//y = faceY - dy
							itemW, 							//itemW
							itemH							//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});

		});
	}

    function _mouth(faces){
    	console.log("Putting on mouths...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.mouth[Math.floor(Math.random()*itemList.mouth.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.mouth){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor;

						//Item Scale proportionally to mouth width
						var itemW = img.width*mouthWidth[i]/img.width*scaleFactor;
						var itemH = img.height*mouthWidth[i]/img.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(mouthCenter[i].x, mouthCenter[i].y); 		//change context reference point to center so we can rotate about the center point
						ctx.rotate(angleOfEyesRadians[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(-mouthCenter[i].x, -mouthCenter[i].y); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img,
							mouthCenter[i].x-0.5*itemW,  	//x = faceX - dx
							mouthCenter[i].y-0.5*itemH, 	//y = faceY - dy
							itemW, 							//itemW
							itemH							//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});

		});
	}

    function _beard(faces){
    	console.log("Putting on beards...");
    	return new Promise(function(resolve, reject) {

    		var chosenItems = [];
    		var chosenItemsPaths = [];
			for (var i=0; i<faces.length; i++){
				chosenItems.push(itemList.beard[Math.floor(Math.random()*itemList.beard.length)]);
				chosenItemsPaths.push(chosenItems[i].path);
			};

    		async.map(chosenItemsPaths, fs.readFile, function(err, results) {
				if (err) throw err;
				for (var i=0; i<faces.length; i++){
					if (Math.random()<propProbability.beard){
						var img = new Image;
						img.src = results[i];

						var scaleFactor = chosenItems[i].scaleFactor;
						var yFactor = chosenItems[i].yFactor;

						//Item Scale proportionally to face width
						var itemW = img.width*faceW[i]/img.width*scaleFactor;
						var itemH = img.height*faceW[i]/img.width*scaleFactor;
						
						//Item rotate and translate
						ctx.translate(underLipBottom[i].x, underLipBottom[i].y); 		//change context reference point to center so we can rotate about the center point
						ctx.rotate(angleOfEyesRadians[i]); 					//Rotate item so it aligns with face axis
						ctx.translate(0,faceH[i]*yFactor);
						ctx.translate(-underLipBottom[i].x, -underLipBottom[i].y); 	//change back context reference point

						//Draw Item
						ctx.drawImage(img,
							underLipBottom[i].x-0.5*itemW,  	//x = faceX - dx
							underLipBottom[i].y-0.5*itemH, 	//y = faceY - dy
							itemW, 							//itemW
							itemH							//itemH
						);

						//Reset All Transformations
						ctx.rotate(-angleOfEyesRadians[i]); 	//Reset rotation
						ctx.setTransform(1, 0, 0, 1, 0, 0); 	//http://www.w3schools.com/tags/canvas_settransform.asp
					};
	    		};
	    		resolve(faces);

	    	});

		});
	}
	//////////////////////////////////////////////////////////

	function _saveImage(){
		console.log("Saving image...");
    	return new Promise(function(resolve, reject) {
			//Output Image file
			var dataUrl = canvas.toDataURL(); //encoded image data

			// strip off the data: url prefix to get just the base64-encoded bytes
			var data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(data, 'base64'); //decode the base64 data
			fs.writeFile(imageOutput, buf, function(){
			    console.log("Saved image to: " + imageOutput);
			    resolve(instagramData[recordNum]);
			});
		});
	}

	//////////////////////////////////////////////////////////
	//We define what we want to expose here: our API
    return {
        photoBooth: photoBooth
    };

})();

//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////













