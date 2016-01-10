//////////////////////////////////////////////////////////
	//Requires
	var Horseman = require('node-horseman');
	var horseman = new Horseman({timeout:10000});

	horseman
		.log("Going to Website")
		.open('https://encodable.com/uploaddemo/') //open account @laughingbooth
		.upload("input[type='file']", __dirname + "/image22d.jpg")
		.wait(2000)
		.screenshot(__dirname + "/screenshotTest.png")
		.close()

