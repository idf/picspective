/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';
    var app = angular.module('picspective.selection-controllers', []);

    // Config for image carousel
    var image_duration = 3000;

    var scopeNextImage = function($timeout, vm, img_list, index) {
      if (index < img_list.length) {
        vm.current_image = img_list[index];
        $timeout(function() {
          if (index+1 === img_list.length) $("#current-image").hide();
          else {
            scopeNextImage($timeout, vm, img_list, index+1);
          }
        }, image_duration);
      }
    }

    app.controller('SelectionController', ['$http', '$scope', '$timeout', 'searchDataService', function($http, $scope, $timeout, sharedService) {
        var vm = this;

        var tmp_img_list = [
        {
          url: "http://lorempixel.com/output/nightlife-q-c-640-480-10.jpg",
          comment: "Look at this incredible picture!"
        },
        {
          url: "http://lorempixel.com/output/food-q-c-640-480-3.jpg",
          comment: "Wow! An incredible photo!"
        },
        {
          url: "http://lorempixel.com/output/technics-q-c-640-480-4.jpg",
          comment: "Shiiiit. This is dope!"
        }];
        scopeNextImage($timeout, vm, tmp_img_list, 0);
    }]);

})();