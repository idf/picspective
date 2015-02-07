/**
 * Created by Danyang on 2/7/2015.
 */
(function () {

    'use strict';
    var app = angular.module('picspective.share-controllers', []);

    app.controller('ShareController', ['$http', '$scope', function($http, $scope) {
        var vm = this;
        vm.post_url = {};
        vm.share = share;

        function share() {
            vm.post_url = window.location.href;
            console.log(vm.post_url);
            FB.ui({
                method: 'feed',
                link: vm.post_url,
                caption: vm.comment,
            }, function(response){});
        }

        var key = window.location.pathname.split("/")[1];

        var ImageList = Parse.Object.extend("ImageList");
        var queryIL = new Parse.Query(ImageList);

        queryIL.get(key, {
            success: function (imageList) {
                var il_comment = imageList.attributes.comment;
                vm.comment = il_comment;
                var il_photos = imageList.attributes.selected_img_list.split(",");
                vm.images = []
                console.log(il_photos);

                for (var i = 0; i < il_photos.length; i++) {
                    var il_photo_truncated = il_photos[i].split('/').slice(0,-2).join('/');
                    console.log(il_photo_truncated);
                    var cur_photo = il_photos[i];
                    var long_url = 'http://api.instagram.com/oembed?url=' + il_photo_truncated + '?client_id=8f54d78c6a544f33b67f3ea4600adcce&callback=?';
                    $.getJSON(long_url,
                        function (data) {
                            // il_photos.push(data);
                            console.log(data);
                            vm.images.push(data);
                            if(!$scope.$$phase) {
                              $scope.$apply();
                            }
                            // console.log(cur_photo_url, data);
                        }
                   );
                }

                
            },
            error: function (object, error) {
            }
        });

    }]);

})();