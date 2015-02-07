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
    var scopeNextImage = function(selectionService, $timeout, vm, $scope, index) {
      console.log("scoping "+index+" of "+vm.query_img_list);
      if (vm.query_img_list.length == 0 || vm.selected_img_list.length == max_photos) {
        endSection(selectionService, vm.selected_img_list);
      }
      vm.current_image = vm.query_img_list[index];
      if(!$scope.$$phase) {
        $scope.$apply();
      }
      var timer = $timeout(function() {
        if (index+1 === vm.query_img_list.length) index = -1;
        scopeNextImage(selectionService, $timeout, vm, $scope, index+1);
      }, image_duration);
      $("#current-image").unbind();
      $("#current-image").mousedown(function() {
        vm.selected_img_list.push($(this).attr('src'));
        if(!$scope.$$phase) {
          $scope.$apply();
        }
        $timeout.cancel(timer);
        vm.query_img_list.splice(index, 1);
        if (index === vm.query_img_list.length) index = 0;
        scopeNextImage(selectionService, $timeout, vm, $scope, index);
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
      // var ImageList = Parse.Object.extend("ImageList");
      // selectionService.prepForBroadcast(selected_img_list);
    }

    app.controller('SelectionController', ['$http', '$scope', '$timeout', 'searchDataService', 'selectionDataService', function($http, $scope, $timeout, searchService, selectionService) {
        
        var vm = this;
        vm.saveToParse = saveToParse;
        vm.selected_img_list = [] 

        $scope.$on('searchDataServiceReady', function() {
          console.log(searchService.msg);
          vm.query_img_list = searchService.msg;
          scopeNextImage(selectionService, $timeout, vm, $scope, 0);
          eventHandlers(selectionService, vm.selected_img_list);
        });

        function saveToParse() {
          console.log(vm.selected_img_list)
          var ImageList = Parse.Object.extend("ImageList");
          var imageList = new ImageList();
          imageList.set("selected_img_list",vm.selected_img_list.join(","));
          imageList.set("comment", vm.story_comment);
          imageList.save(null,{
             success: function(imageList){
                 console.log(imageList.id+" pushed to Parse");
             }
          });
          }
    }]);

    app.factory('selectionDataService', ["$http", "$rootScope", function($http, $rootScope, query) {
        var sharedService = {};
        sharedService.prepForBroadcast = prepForBroadcast;
        sharedService.broadcastItem = broadcastItem;

        function broadcastItem() {
            // sharedService.selected_img_list = 
            // $rootScope.$broadcast('selectionDataServiceReady');
        }

        function prepForBroadcast(selected_img_list) {
          // Set up parse, save data in parse, broadcast message
          // Parse.initialize("3SVjJP6LzARbXokFN6TJ12XSDjUEuVSoUc3PVkHn", "Wj1HLAcUcYUEJ8XBnI1aF4e5WLq4jMvJaCeyju4U");
        }

        return sharedService;
    }]);

})();