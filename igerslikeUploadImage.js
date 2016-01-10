//////////////////////////////////////////////////////////
/*
Igerslike Upload Image
*/
//////////////////////////////////////////////////////////

module.exports = (function(){

	//////////////////////////////////////////////////////////
	//Setup
	var photoBoothImage = __dirname + '/instagramPost.jpg'; //main saved photoboothed image file
	var horseman;

	//////////////////////////////////////////////////////////
	//Requires
	var Horseman = require('node-horseman');

	//////////////////////////////////////////////////////////
	function igerslikeHorseman(instagramCaption){

		horseman = new Horseman({timeout:10000});

		return horseman
			//Go to Igerslike.com
			.log("Going to Igerslike")
			.then(_cleanUp)
			.headers({
				//"Host": "localhost:1337", //the Host prevents us from connecting to our proxy!
				"Cache-Control": "max-age=0",
				//"Connection": "keep-alive",
				"Accept": "*/*",
				"Content-Security-Policy": "frame-ancestors 'none'",
				//"Accept": "text/html,application/xhtml+xml,appliation/xml;q=0.9,image/webp,*/*;q=0.8",
				//"Accept-Encoding": "gzip, deflate, sdch",
				"Accept-Language": "en-US,en;q=0.8"
			})
			.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:41.0) Gecko/20100101 Firefox/41.0")
			.viewport(1024,800)
			.open("https://www.igerslike.com/")
			//.screenshot(__dirname + "/screenshot1.png")

			//login
			.log("Logging in")
			.click("a:contains('Sign in')")
			.wait(1000) //wait for login window to pop in
			.type("input[id='login_username']", 'davidchl')
			.type("input[id='login_password']", 'pt68azy5')
			//.screenshot(__dirname + "/screenshot2.png")

			.click("button[type='button'][id='submit_login']")
			//.click("button:contains('Sign in')")
			.waitForNextPage() //need to wait twice
			.waitForNextPage()
			.wait(4000)
			//.waitForSelector("span:contains('davidchl')")
			//.waitForSelector("a:contains(' My Account')")
			
			//.screenshot(__dirname + "/screenshot3.png")

			//Go to Igerslike instagram account page
			.log("Going to Igerslike instagram account page")
			.open('https://www.igerslike.com/ig/account/home/?id=278946') //open account @laughingbooth
			.click("a:contains(' Upload Photo')")
			.wait(1000) //wait for upload window to pop in
			//.screenshot(__dirname + "/screenshot4.png")

			//Upload Window
			.log("Upload Window")
			.type("textarea[id='captions']", instagramCaption)
			.upload("div[id='uploadimg'] div[class='modal-body'] div[class='portlet light'] div[class='portlet-body'] form[role='form'] div[class='form-body'] div[class='form-group'] input[type='file']", photoBoothImage)
			.wait(1000)
			.click("div[id='uploadimg'] div[class='modal-body'] div[class='portlet light'] div[class='portlet-body'] form[role='form'] div[class='form-actions'] button[name='submit']")
			
			//.screenshot(__dirname + "/screenshot5.png")

			//end
			.log("Done!")
			.then(_cleanUp)
			.close()
	}

	function _cleanUp(){
		return horseman
			.evaluate( function(){ spoofCraigslist } )
			.cookies([])
			.evaluate( function(){
				localStorage.clear();
			})
	}

	//////////////////////////////////////////////////////////
	//We define what we want to expose here: our API
    return {
        igerslikeHorseman: igerslikeHorseman
    };

})();