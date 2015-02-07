/**
 * Created by Danyang on 2/7/2015.
 */
(function () {
    'use strict';
    var app = angular.module('picspective.share-controllers', []);


    app.controller('ShareController', ['$http', '$scope', 'SharingDataService', function ($http, $scope, sharingDataService) {
        var vm = this;

        var InstaImage = Parse.Object.extend("InstaImage");
        var ImageList = Parse.Object.extend("ImageList");
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
        var caption;
        //for (var i = 0; i < imageURLs.length; i++) {
        //    $.getJSON(
        //        'http://api.instagram.com/oembed?url=' + imageURLs[i] + '?client_id=8f54d78c6a544f33b67f3ea4600adcce&callback=?',
        //        function (data) {
        //            console.log(data);
        //            var instaImage = new InstaImage();
        //            for (var key in data) {
        //                if (!data.hasOwnProperty(key)) { //The current property is not a direct property of p
        //                    continue;
        //                }
        //                instaImage.set(key.toString(), data[key]);
        //            }
        //            //instaImage.set("imagedata", data);
        //            instaImage.save(null
        //                , {
        //                    success: function (instaImage) {
        //                        //alert('New object created with objectId: ' + instaImage.id);
        //                        listOfParseImage.push(instaImage.id);
        //                        console.log(instaImage.id+" uploaded");
        //                    }
        //                //,
        //                //    error: function (instaImage, error) {
        //                //        alert('Failed to create new object, with error code: ' + error.message);
        //                //    }
        //                }
        //            );
        //            //$("share").innerHTML += data.html;
        //        }
        //    );
        //}

        //listOfParseImage = ["Vwyu1Fozcm",
        //    "IGNQUFnhur",
        //    "XlUEtC1x6t",
        //    "XdgwBoe01d",
        //    "GQjkbNBXEB",
        //    "mi7chHzB8m",
        //    "dgETB32v6S",
        //    "SfuIgdEXwn",
        //    "MA3GHLfFpP"
        //];
        //caption = "Life as a NTU student is Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sollicitudin risus eget purus ultricies scelerisque. Praesent lacinia tellus ut ligula sodales fringilla. Sed tempor arcu non augue tincidunt aliquet. Vestibulum quis rutrum arcu. Duis vel gravida orci, in faucibus leo. Aenean porta tellus quis tellus sagittis, vel fringilla odio semper. Morbi tincidunt auctor elit ut scelerisque. In vitae tortor a diam maximus volutpat. Integer sit amet nisl ipsum. Fusce ante ante, auctor quis pulvinar ut, pretium in lectus. Sed accumsan, lorem sit amet pulvinar condimentum, purus metus eleifend turpis, vel hendrerit justo diam quis diam. Etiam porta a augue at venenatis. Aenean sed varius ipsum. Ut ornare ac augue vitae malesuada. Morbi massa mauris, dapibus ut tellus sed, vehicula malesuada ipsum. Donec tempor pretium mi, eget finibus ex interdum quis.";

        //var imageList = new ImageList();
        //imageList.set("listOfParseImage",listOfParseImage.join());
        //imageList.set("caption", caption);
        //imageList.save(null,{
        //    success: function(imageList){
        //        console.log(imageList.id+" pushed to Parse");
        //    }
        //});
////////////////////////////////////
//        var imageListID = "kmLySAGuBp";
//        var imageList = new ImageList();
//        var queryIL = new Parse.Query(ImageList);
//        queryIL.get(imageListID, {
//            success: function (imageList) {
//
//                console.log(imageList.id + " downloaded");
//                caption = imageList.get("caption");
//                listOfParseImage = imageList.get("listOfParseImage").split(',');
//                //console.log(caption+listOfParseImage.toString());
//
//                var queryLOPI = new Parse.Query(InstaImage);
//                for (var i = 0; i < listOfParseImage.length; i++) {
//                    queryLOPI.get(listOfParseImage[i], {
//                        success: function (instaImage) {
//                            // The object was retrieved successfully.
//                            $("#share").append(instaImage.get("html"));
//                            console.log(instaImage.id + " downloaded");
//                            $('#share-caption').html(caption);
//                        },
//                        error: function (object, error) {
//                            // The object was not retrieved successfully.
//                            // error is a Parse.Error with an error code and message.
//                        }
//                    });
//                }
//            },
//            error: function (object, error) {
//            }
//        });

        function loadImages(sources, callback) {
            var images = {};
            var loadedImages = 0;
            var numImages = 0;
            // get num of sources
            for(var src in sources) {
                numImages++;
            }
            for(var src in sources) {
                images[src] = new Image();

                images[src].onload = function() {
                    if(++loadedImages >= numImages) {
                        callback(images);
                    }
                };
                images[src].src = sources[src];
            }
        }


        var SIZE=306*3;
        var canvas = $('#share-canvas');
        var context = canvas.get(0).getContext('2d');
        canvas.get(0);
        canvas.width(SIZE).height(SIZE);
        canvas.attr('width', SIZE).attr('height', SIZE);
        SIZE=306;

        var sources = [
            'http://instagram.com/p/yt4-OAjMtR/media/?size=m',
            'http://instagram.com/p/v792rvjMpb/media/?size=m',
            'http://instagram.com/p/u-jP_sDMtf/media/?size=m',
            'http://instagram.com/p/uIrlapDMlc/media/?size=m',
            'http://instagram.com/p/rsoCDAjMtI/media/?size=m',
            'http://instagram.com/p/rsoCDAjMtI/media/?size=m',
            'http://instagram.com/p/oHnZqpjMjv/media/?size=m',
            'http://instagram.com/p/mZV42pjMva/media/?size=m',
            'http://instagram.com/p/mFBgLMDMuV/media/?size=m'
        ];

        function drawRectanlesBorders(img,x,y,width,height,deg){

            var c=$("#share-canvas");
            var ctx=c.get(0).getContext("2d");
            var rad = deg * Math.PI / 180;

            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(rad);
            ctx.beginPath();
            ctx.rect(width / 2 * (-1), height / 2 * (-1), width, height);
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();
        }


        function drawImageRot(img,x,y,width,height,deg){

            var c=$("#share-canvas");
            var ctx=c.get(0).getContext("2d");
            var rad = deg * Math.PI / 180;

            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(rad);
            ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
            ctx.restore();
        }


        loadImages(sources, function(images) {

            //draw background  image
            //drawImageRot(images.bg, 0, 0, 600, 600,0);

            //draw borders
            //drawRectanlesBorders(images.b, 380, 55,277, 184,-20);
            //
            //
            //drawRectanlesBorders(images.a,-20,-20, 300, 224,-30);
            //drawRectanlesBorders(images.e, 130, 150,350, 274,0);
            //drawRectanlesBorders(images.d, 320, 430,277, 184,20);
            //drawRectanlesBorders(images.f, 0, 380, 240,160,-10);

            //draw images
            //drawImageRot(images.b, 380, 55,277, 184,-20);
            //
            //drawImageRot(images.a,-20,-20, 300, 224,-30);
            //drawImageRot(images.e, 130, 150,350, 274,0);
            //drawImageRot(images.d, 320, 430,277, 184,20);
            //drawImageRot(images.f, 0, 380, 240,160,-10);
            for (var i =0; i< sources.length; i++){
                drawImageRot(images[i],(Math.floor(i/3))*SIZE,(i%3)*SIZE,SIZE,SIZE,0);
            }
        });
        var img    = canvas.toDataURL("image/png");

    }]);

    app.factory('SharingDataService', ["$http", "$rootScope", function($http, $rootScope) {
        var sharedService = {};
        //sharedService.prepForBroadcast = prepForBroadcast;
        //sharedService.broadcastItem = broadcastItem;
        //
        //function broadcastItem() {
        //    $rootScope.$broadcast('sharingDataServiceReady');
        //}
        //
        //function prepForBroadcast(selected_img_list) {
        //
        //}
        //
        return sharedService;
    }]);

})();