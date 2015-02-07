/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';

    var INST_TOKEN = "b3f8d7abdaf04e8f85ffeaf9ff4c96c7";
    var INST_API_URL = "https://api.instagram.com/v1";
    var GG_TOKEN = "AIzaSyAs2yRcXM_Q_Ub8h5iTf5FP36f2RoiWO7Y";

    var app = angular.module('picspective.search-controllers', []);

    app.controller('SearchController', ['$http', '$scope', 'searchDataService', function($http, $scope, sharedService) {
        var vm = this;
        vm.searchQuery = searchQuery;

        function searchQuery() {
            sharedService.prepForBroadcast(vm.query);
            $scope.$on('collocationDataReady', function() {
                // do handling
            });
        }
    }]);


    app.factory('searchDataService', ["$http", "$rootScope", function($http, $rootScope, query) {
        var sharedService = {};
        sharedService.prepForBroadcast = prepForBroadcast;
        sharedService.broadcastItem = broadcastItem;

        function broadcastItem() {
            $rootScope.$broadcast('searchDataServiceReady');
        }

        function prepForBroadcast(query) {
            // google
            // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=API_KEY
            function loc2geocode() {
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+
                GG_TOKEN+"&address="+query.loc).success(function(data) {
                    console.log(data);
                    var geocode = data.results[0].geometry.location;  // lat, lng
                    console.log(geocode);
                });
            }

            // instagram
            var geocode = {
                'lat': 1.3343083,
                'lng': 103.7419582
            };
            function instLocSearch(geocode) {
                $http.get(INST_API_URL+"/locations/search"+
                    "?access_token="+INST_TOKEN+
                    "&lat="+geocode.lat+
                    "&lng="+geocode.lng
                ).success(function(data) {
                    console.log(data);
                });
            }

            instLocSearch(geocode);
        }
        return sharedService;
    }]);
})();