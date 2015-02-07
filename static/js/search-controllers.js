/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';
    var app = angular.module('picspective.search-controllers', []);

    app.controller('SearchController', ['$http', '$scope', 'searchDataService', function($http, $scope, sharedService) {
        var vm = this;

    }]);

    app.factory('searchDataService', ["$http", "$rootScope", function($http, $rootScope) {
        var sharedService = {};
        sharedService.prepForBroadcast = prepForBroadcast;
        sharedService.broadcastItem = broadcastItem;

        function broadcastItem() {
            $rootScope.$broadcast('searchDataServiceReady');
        }

        function prepForBroadcast(str) {
            $http.get('instagram'+str).success(function(data) {
                console.log(data);

            });
        }

        return sharedService;
    }]);
})();