var images = require("images");

images(__dirname + "/image22.jpg")     				//Load image from file
    .save(__dirname + "/image22.jpg", {   //Save the image to a file,whih quality 50
        quality : 75
    });