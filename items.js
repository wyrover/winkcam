var items = (function(){

    var hats = 
        [
            {
                path: __dirname + '/photobooth/hats/hat_blackHair.png',
                info: "Blach hair women - classic",
                scaleFactor: 1.4,
                yFactor: 0.6
            },
                        // {
                        //     path: __dirname + '/photobooth/hats/hat_cap.png',
                        //     info: "Blue baseball cap",
                        //     scaleFactor: 1.5,
                        //     xFactor: 0.2,
                        //     yFactor: -0.7
                        //  },
            {
                path: __dirname + '/photobooth/hats/hat_cook.png',
                info: "Chief Hat",
                scaleFactor: 1.7,
                xFactor: -0.13,
                yFactor: -0.95
            },
            {
                path: __dirname + '/photobooth/hats/hat_cowboy.png',
                info: "Cowboy hat",
                scaleFactor: 1.8,
                xFactor: 0,
                yFactor: -0.9
            },
            {
                path: __dirname + '/photobooth/hats/hat_gangster.png',
                info: "20's Gangster hat",
                scaleFactor: 1.4,
                xFactor: 0,
                yFactor: -1
            },
            {
                path: __dirname + '/photobooth/hats/hat_postman.png',
                info: "Postman hat",
                scaleFactor: 1.5,
                xFactor: 0,
                yFactor: -0.9
            },
            {
                path: __dirname + '/photobooth/hats/hat_white.png',
                info: "Cowboy hat",
                scaleFactor: 1.9,
                xFactor: 0,
                yFactor: -0.95
            },
            {
                path: __dirname + '/photobooth/hats/hat_catEars.png',
                info: "Cat ears",
                scaleFactor: 1.4,
                xFactor: 0,
                yFactor: -0.8
            }
        ];

    var eyebrows = 
        [
            {
                path: __dirname + '/photobooth/eyebrows/eyebrow_brown.png',
                info: "brown eyebrows",
                scaleFactor: 1,
                yFactor: -0.02
            },
            {
                path: __dirname + '/photobooth/eyebrows/eyebrow_cartoon.png',
                info: "brown cartoon eyebrows",
                scaleFactor: 1,
                yFactor: -0.03
            },
            {
                path: __dirname + '/photobooth/eyebrows/eyebrow_brownThin.png',
                info: "brown thin eyebrows",
                scaleFactor: 1.5,
                yFactor: -0.03
            }
        ];

    var glasses = 
        [
            {
                path: __dirname + '/photobooth/eyes/glasses_stars.png',
                info: "star glasses",
                scaleFactor: 1
            },
            {
                path: __dirname + '/photobooth/eyes/glasses_kanye.png',
                info: "blinds glasses",
                scaleFactor: 1.1
            },
            {
                path: __dirname + '/photobooth/eyes/glasses_color.png',
                info: "pink glasses",
                scaleFactor: 1.1
            },
            {
                path: __dirname + '/photobooth/eyes/glasses_pink.png',
                info: "pink glasses",
                scaleFactor: 1.1
            },
            {
                path: __dirname + '/photobooth/eyes/glasses_shades.png',
                info: "shades",
                scaleFactor: 1.1
            },
            {
                path: __dirname + '/photobooth/eyes/glasses_3d2.png',
                info: "3d glasses",
                scaleFactor: 1.15
            }
        ];

    var nose = 
        [
            {
                path: __dirname + '/photobooth/nose/nose_pig.png',
                info: "pig nose",
                scaleFactor: 1,
                yFactor: 0
            },
            {
                path: __dirname + '/photobooth/nose/nose_redCircle.png',
                info: "clown red circle nose",
                scaleFactor: 1,
                yFactor: 0
            },
            {
                path: __dirname + '/photobooth/nose/nose_cat.png',
                info: "cat nose",
                scaleFactor: 2,
                yFactor: -0.08
            },
                        // {
                        //     path: __dirname + '/photobooth/nose/nose_deer.png',
                        //     info: "deer nose",
                        //     scaleFactor: 3,
                        //     yFactor: 0
                        // },
            {
                path: __dirname + '/photobooth/nose/nose_dog.png',
                info: "dog nose",
                scaleFactor: 1,
                yFactor: -0.05
            }
        ];

    var mustache = 
        [
            {
                path: __dirname + '/photobooth/mustache/mustache_vectorBlack.png',
                info: "Vector black mustache",
                scaleFactor: 1.3,
                yFactor: 0.05
            },
            {
                path: __dirname + '/photobooth/mustache/mustache_thinLong.png',
                info: "Thin and long mustache",
                scaleFactor: 1.8,
                yFactor: -0.03
            },
            {
                path: __dirname + '/photobooth/mustache/mustache_brown.png',
                info: "Brown mustache",
                scaleFactor: 1.3,
                yFactor: 0.08
            },
            {
                path: __dirname + '/photobooth/mustache/mustache_gray.png',
                info: "Gray mustache",
                scaleFactor: 1.4,
                yFactor: 0.08
            },
            {
                path: __dirname + '/photobooth/mustache/mustache_wood.png',
                info: "Wood mustache",
                scaleFactor: 1.4,
                yFactor: 0.09
            }
        ];

    var mouth = 
        [
            {
                path: __dirname + '/photobooth/mouth/mouth_lips.png',
                info: "Red lips",
                scaleFactor: 1
            },
            {
                path: __dirname + '/photobooth/mouth/mouth_smile.png',
                info: "Red lips smiling",
                scaleFactor: 1
            },
            {
                path: __dirname + '/photobooth/mouth/mouth_kiss.png',
                info: "Kiss",
                scaleFactor: 0.7
            }
                    // {
                    //     path: __dirname + '/photobooth/mouth/mouth_sad.png',
                    //     info: "Sad",
                    //     scaleFactor: 1.3
                    // }
                    // {
                    //     path: __dirname + '/photobooth/mouth/mouth_cartoon.png',
                    //     info: "Cartoon yelling",
                    //     scaleFactor: 0.9
                    // },
                    // {
                    //     path: __dirname + '/photobooth/mouth/mouth_vampire.png',
                    //     info: "Vampire",
                    //     scaleFactor: 1
                    // },
                    // {
                    //     path: __dirname + '/photobooth/mouth/mouth_yellPink.png',
                    //     info: "Cartoon yell pink",
                    //     scaleFactor: 0.9
                    // }
        ];

    var beard = 
        [
            {
                path: __dirname + '/photobooth/beard/beard_brown.png',
                info: "Brown Beard",
                scaleFactor: 1.2,
                yFactor: 0.25
            },
            {
                path: __dirname + '/photobooth/beard/beard_small.png',
                info: "White Small Chin Beard",
                scaleFactor: 0.5,
                yFactor: 0.35
            },
            {
                path: __dirname + '/photobooth/beard/beard_white.png',
                info: "White Beard",
                scaleFactor: 0.9,
                yFactor: 0.5
            },
            {
                path: __dirname + '/photobooth/beard/beard_circle.png',
                info: "Circle",
                scaleFactor: 0.3,
                yFactor: 0.25
            },
            {
                path: __dirname + '/photobooth/beard/beard_longThin.png',
                info: "Black long and thin",
                scaleFactor: 0.3,
                yFactor: 0.6
            },
            {
                path: __dirname + '/photobooth/beard/beard_medium.png',
                info: "Medium brown beard",
                scaleFactor: 0.5,
                yFactor: 0.13
            }
        ];
    
    //We define what we want to expose here: our API
    return {
        hats: hats,
        eyebrows: eyebrows,
        glasses: glasses,
        nose: nose,
        mustache: mustache,
        mouth: mouth,
        beard: beard
    };

})();

module.exports = items;