/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';
    var app = angular.module('picspective.selection-controllers', []);

    // Config for image carousel
    var image_duration = 4000;
    var max_photos = 9;

    // Brings the next image into scope, call with index 0 of list
    // Iterates (cyclic) thru list recursively with a timeout of specified duration
    var scopeNextImage = function(selectionService, $timeout, vm, $scope, img_list, selected_img_list, index) {
      console.log("scoping "+index+" of "+img_list);
      if (img_list.length == 0 || selected_img_list.length == max_photos) {
        endSection(selectionService, selected_img_list);
      }
      vm.current_image = img_list[index];
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      var timer = $timeout(function() {
        if (index+1 === img_list.length) index = -1;
        scopeNextImage(selectionService, $timeout, vm, $scope, img_list, selected_img_list, index+1);
      }, image_duration);
      $("#current-image").unbind();
      $("#current-image").mousedown(function() {
        selected_img_list.push($(this).attr('src'));
        $timeout.cancel(timer);
        img_list.splice(index, 1);
        if (index === img_list.length) index = 0;
        scopeNextImage(selectionService, $timeout, vm, $scope, img_list, selected_img_list, index);
      });
    }

    // Controls for user action events (buttons, hovering, styling)
    var eventHandlers = function(selectionService, selected_img_list) {
      $("#current-image-wrap").hover(function() {
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
        }
        else {
          $(this).addClass("selected");
        }
      });
      $("#selection-done").click(function() {
        endSection(selectionService, selected_img_list);
      });
    }

    // Moves on to share section
    var endSection = function(selectionService, selected_img_list) {
      console.log(selected_img_list);
      selectionService.prepForBroadcast(selected_img_list);
    }

    app.controller('SelectionController', ['$http', '$scope', '$timeout', 'searchDataService', 'selectionDataService', function($http, $scope, $timeout, searchService, selectionService) {
        var vm = this;
        var selected_img_list = [] 
        var tmp_img_list = [
        {
          url: "http://lorempixel.com/output/nightlife-q-c-640-480-10.jpg",
          comment: "Look at this incredible picture!"
        },
        {
          url: "http://lorempixel.com/output/nightlife-q-c-640-480-1.jpg",
          comment: "2nd pic"
        },
        {
          url: "http://lorempixel.com/output/food-q-c-640-480-3.jpg",
          comment: "Wow! An incredible photo!"
        },
        {
          url: "http://lorempixel.com/output/technics-q-c-640-480-4.jpg",
          comment: "Shiiiit. This is dope!"
        }];
        scopeNextImage(selectionService, $timeout, vm, $scope, tmp_img_list, selected_img_list, 0);
        eventHandlers(selectionService, selected_img_list);
    }]);

    app.factory('selectionDataService', ["$http", "$rootScope", function($http, $rootScope, query) {
        var sharedService = {};
        sharedService.prepForBroadcast = prepForBroadcast;
        sharedService.broadcastItem = broadcastItem;

        function broadcastItem() {
            $rootScope.$broadcast('selectionDataServiceReady');
        }

        function prepForBroadcast(selected_img_list) {
          // Set up parse, save data in parse, broadcast message
          Parse.initialize("3SVjJP6LzARbXokFN6TJ12XSDjUEuVSoUc3PVkHn", "Wj1HLAcUcYUEJ8XBnI1aF4e5WLq4jMvJaCeyju4U");
        }

        return sharedService;
    }]);

})();