//////////////////////////////////////////////////////////
/*
Get Instagram Media by Tags
https://www.npmjs.com/package/instagram-node
*/
//////////////////////////////////////////////////////////

module.exports = (function(){

    var ig = require('instagram-node').instagram();
    ig.use({ access_token: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' });
    //Need to get Instagram Access Token

    function getInstagramImageData(chosenTag){
        return new Promise(function(resolve,reject){
            ig.tag_media_recent(chosenTag, function(err, medias, pagination, remaining, limit) {
                var filteredRecords = medias.filter(_isGoodInstagramImage)

                console.log("Total Records: " + filteredRecords.length)
              	console.log("---");

                resolve(filteredRecords);
            });
        });
    }

    var _isGoodInstagramImage = function(record) {
        var imgW = record.images.standard_resolution.width
        var imgH = record.images.standard_resolution.height

        //Filter conditions: has to be an image, must be a square
        var tf = (record.type==='image' && imgW===imgH)
        return tf;
    }

    //////////////////////////////////////////////////////////
    //We define what we want to expose here: our API
    return {
        getInstagramImageData: getInstagramImageData
    };

})();
