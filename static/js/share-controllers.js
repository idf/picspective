/**
 * Created by Danyang on 2/7/2015.
 */
(function () {
    'use strict';
    var app = angular.module('picspective.share-controllers', []);

    var InstaImage = Parse.Object.extend("InstaImage");
    var imageURLs = [
        'http://instagram.com/p/yt4-OAjMtR/',
        'http://instagram.com/p/v792rvjMpb/',
        'http://instagram.com/p/u-jP_sDMtf/',
        'http://instagram.com/p/uIrlapDMlc/',
        'http://instagram.com/p/rsoCDAjMtI/',
        'http://instagram.com/p/rsoCDAjMtI/',
        'http://instagram.com/p/oHnZqpjMjv/',
        'http://instagram.com/p/mZV42pjMva/',
        'http://instagram.com/p/mFBgLMDMuV/'
    ];
    var listOfParseImage = [];
    for (var i = 0; i < imageURLs.length; i++) {
        $.getJSON(
            'http://api.instagram.com/oembed?url=' + imageURLs[i] + '?client_id=8f54d78c6a544f33b67f3ea4600adcce&callback=?',
            function (data) {
                console.log(data);
                var instaImage = new InstaImage();
                for (var key in data) {
                    if (!data.hasOwnProperty(key)) { //The current property is not a direct property of p
                        continue;
                    }
                    instaImage.set(key.toString(), data[key]);
                }
                //instaImage.set("imagedata", data);
                instaImage.save(null
                    , {
                        success: function (instaImage) {
                            //alert('New object created with objectId: ' + instaImage.id);
                            listOfParseImage.push(instaImage.id);
                            console.log(instaImage.id+" uploaded");
                        }
                    //,
                    //    error: function (instaImage, error) {
                    //        alert('Failed to create new object, with error code: ' + error.message);
                    //    }
                    }
                );
                //$("share").innerHTML += data.html;
            }
        );
    }

    listOfParseImage = ["Vwyu1Fozcm",
    "IGNQUFnhur",
        "XlUEtC1x6t",
        "XdgwBoe01d",
        "GQjkbNBXEB",
        "mi7chHzB8m",
        "dgETB32v6S",
        "SfuIgdEXwn",
        "MA3GHLfFpP"
    ];
    var caption = "Life as a NTU student is Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sollicitudin risus eget purus ultricies scelerisque. Praesent lacinia tellus ut ligula sodales fringilla. Sed tempor arcu non augue tincidunt aliquet. Vestibulum quis rutrum arcu. Duis vel gravida orci, in faucibus leo. Aenean porta tellus quis tellus sagittis, vel fringilla odio semper. Morbi tincidunt auctor elit ut scelerisque. In vitae tortor a diam maximus volutpat. Integer sit amet nisl ipsum. Fusce ante ante, auctor quis pulvinar ut, pretium in lectus. Sed accumsan, lorem sit amet pulvinar condimentum, purus metus eleifend turpis, vel hendrerit justo diam quis diam. Etiam porta a augue at venenatis. Aenean sed varius ipsum. Ut ornare ac augue vitae malesuada. Morbi massa mauris, dapibus ut tellus sed, vehicula malesuada ipsum. Donec tempor pretium mi, eget finibus ex interdum quis.";



    var query = new Parse.Query(InstaImage);
    $('#share-caption').innerHTML = caption;
    $('share-photos').innerHTML="";
    for (var i=0; i < listOfParseImage.length; i++) {
        query.get(listOfParseImage[i], {
            success: function (instaImage) {
                // The object was retrieved successfully.
                $("share").innerHTML += instaImage.get("html");
                console.log(instaImage.id+" downloaded");
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
            }
        });
    }


    //app.controller('downloadController', ['$http', '$scope', 'selectionDataService', function ($http, $scope, selectionService){
    //
    //}])

})();