/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';
    var app = angular.module('picspective.share-controllers', []);

    var imageURLs=[
        'http://instagram.com/p/v792rvjMpb/',
        'http://instagram.com/p/yt4-OAjMtR/',
        'http://instagram.com/p/u-jP_sDMtf/',
        'http://instagram.com/p/uIrlapDMlc/'];
    for (var i = 0; i < imageURLs.length; i++) {
        $.getJSON(
            'http://api.instagram.com/oembed?url='+imageURLs[i]+'?client_id=8f54d78c6a544f33b67f3ea4600adcce&callback=?',
            function(data) {
                console.log(data);
                var InstaImage = Parse.Object.extend("InstaImage");
                var instaImage = new InstaImage();
                for (var key in data) {
                    if (!data.hasOwnProperty(key)) {
                        //The current property is not a direct property of p
                        continue;
                    }
                    //Do your logic with the property here
                    instaImage.set(key.toString(),data[key]);
                }
                //instaImage.set("imagedata", data);
                instaImage.save(null, {
                    success: function(instaImage) {
                        // Execute any logic that should take place after the object is saved.
                        alert('New object created with objectId: ' + instaImage.id);
                    },
                    error: function(instaImage, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
                document.getElementById("share").innerHTML+=data.html;
            }
        );
    }

})();