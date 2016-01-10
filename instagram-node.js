//////////////////////////////////////////////////////////
/*
Get Instagram Media by Tags
https://www.npmjs.com/package/instagram-node
*/
//////////////////////////////////////////////////////////

module.exports = (function(){

    var chosenTag = 'selfie';

    var ig = require('instagram-node').instagram();
    ig.use({ access_token: '4369847.e9c4567.20223a1114fa4c0fb5db738d95371a1d' });

    function getInstagramImageData(){
        return new Promise(function(resolve,reject){
            ig.tag_media_recent(chosenTag, function(err, medias, pagination, remaining, limit) {

                  var filteredRecords = medias.filter(_isGoodInstagramImage)

                	console.log("instagram link: " + filteredRecords[0].link);
                	console.log("username: @" + filteredRecords[0].user.username);
                	console.log("media type: " + filteredRecords[0].type);
                	console.log("image id: " + filteredRecords[0].id);
                	console.log("image url: " + filteredRecords[0].images.standard_resolution.url);
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

/*
Example Instagram Record:

{ attribution: null,
  tags: [ 'zeroo', 'selfie' ],
  type: 'image',
  location: null,
  comments: { count: 0, data: [] },
  filter: 'Clarendon',
  created_time: '1452054911',
  link: 'https://www.instagram.com/p/BALzMDcnM2r/',
  likes: { count: 0, data: [] },
  images:
   { low_resolution:
      { url: 'https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/s320x320/e35/10632329_767074333423555_2015933981_n.jpg',
        width: 320,
        height: 320 },
     thumbnail:
      { url: 'https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/s150x150/e35/10632329_767074333423555_2015933981_n.jpg',
        width: 150,
        height: 150 },
     standard_resolution:
      { url: 'https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/s640x640/sh0.08/e35/10632329_767074333423555_2015933981_n.jpg',
        width: 640,
        height: 640 } },
  users_in_photo: [],
  caption:
   { created_time: '1452054911',
     text: '#selfie from #zeroo level...$@rdar swag',
     from:
      { username: 'rj_sidhu92',
        profile_picture: 'https://scontent.cdninstagram.com/hphotos-xpa1/t51.2885-19/s150x150/12357705_1722476921318258_1467900111_a.jpg',
        id: '2346366842',
        full_name: 'RJ SIDHU' },
     id: '1156242859752214480' },
  user_has_liked: false,
  id: '1156242858057715115_2346366842',
  user:
   { username: 'rj_sidhu92',
     profile_picture: 'https://scontent.cdninstagram.com/hphotos-xpa1/t51.2885-19/s150x150/12357705_1722476921318258_1467900111_a.jpg',
     id: '2346366842',
     full_name: 'RJ SIDHU' } }
*/
