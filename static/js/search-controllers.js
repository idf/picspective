/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';

    var INST_API_URL = "https://api.instagram.com/v1";
    var GOOG_TOKEN = "AIzaSyAs2yRcXM_Q_Ub8h5iTf5FP36f2RoiWO7Y";

    var app = angular.module('picspective.search-controllers', ['oauth-services']);

    app.controller('SearchController', ['$http', '$scope', 'searchDataService', function($http, $scope, sharedService) {
        var vm = this;

        vm.query = {};
        vm.query.hour = 3600*3;  // 3 hours
        vm.count = 0;

        vm.finalQuery = finalQuery;
        vm.updateCnt = updateCnt;

        function finalQuery() {

        }

        function updateCnt() {
            vm.query.time = Date.create(vm.query.time);
            vm.count = 0;
            sharedService.prepForCount(vm.query);
            $scope.$on('searchCountServiceReady', function() {
                vm.count += countMedia(sharedService);
                vm.hour = sharedService.hour;
            });
        }

        // private
        function countMedia(service) {
            return service.msg.length;
        }
    }]);


    app.factory('searchDataService', ["$http", "$rootScope", "$q", "oauthService", function($http, $rootScope, $q, oauthService) {
        var sharedService = {};
        sharedService.prepForBroadcast = prepForBroadcast;
        sharedService.broadcastItem = broadcastItem;

        sharedService.prepForCount = prepForCount;
        sharedService.broadcastCount = broadcastCount;
        sharedService.msg = [];
        sharedService.hour = 0;

        oauthService.initialize("instagram");

        function broadcastItem() {
            console.log("broadcastItem");
            $rootScope.$broadcast('searchDataServiceReady');
        }

        function broadcastCount() {
            console.log("broadcastCount");
            $rootScope.$broadcast('searchCountServiceReady');
        }

        function prepForBroadcast(query) {
            loc2geocode(query, false);  // change to callback
        }

        function prepForCount(query) {
            if(oauthService.isReady()) {
                loc2geocode(query, true);
            }
            else {
                oauthService.connect("instagram").then(function () {
                    loc2geocode(query, true);
                });
            }
        }


        // HELPER funcitons
        /**
         * Googel Map service, location to geocode
         * @param query
         * @param flag
         */
        function loc2geocode(query, flag) {
            console.log(query);
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+
            GOOG_TOKEN+"&address="+query.loc).success(function(data) {  // hack around
                var geocode = data.results[0].geometry.location;  // lat, lng
                //console.log("loc2geocode: ");
                //console.log(geocode);
                instLocSearch(query, geocode, flag);
            });
        }

        var geocode_test = {'lat': 1.3343083, 'lng': 103.7419582};

        /**
         * Instagram location search
         * @param query
         * @param geocode
         * @param flag
         */
        function instLocSearch(query, geocode, flag) {
            $http.jsonp(INST_API_URL+"/locations/search"+
            "?access_token="+oauthService.getAccessToken()+
            "&lat="+geocode.lat+
            "&lng="+geocode.lng+
            "&distance=1000"+
            "&callback=JSON_CALLBACK").success(function(data) {
                var geoid = data;
                // console.log("instLocSearch: ");
                // console.log(geoid);
                recentMedia(geoid, Math.floor(query.time/1000), query.hour, flag);  // UNIX stamp
            });
        }

        var geoid_test = {"meta":{"code":200},"data":[{"latitude":1.334249,"id":"1625905","longitude":103.741943,"name":"Boon Lay Raja Shark's Fin And Seafood Restaurant"},{"latitude":1.334374,"id":"1934957","longitude":103.742076,"name":"CW3@Jurong East Interchange Berth B7"},{"latitude":1.33432,"id":"47153690","longitude":103.741812,"name":"Kopitiam @ Jurong East Mrt"},{"latitude":1.33426999,"id":"536953444","longitude":103.742105104,"name":"Llao Llao Westmall"},{"latitude":1.334421,"id":"72127297","longitude":103.74207301,"name":"Bus CW3\/CW4 Lane To Tuas Checkpoint"},{"latitude":1.33425,"id":"346225591","longitude":103.7421131,"name":"Toastbox Jem"},{"latitude":1.3341477,"id":"485026021","longitude":103.7420142,"name":"New York Skin Solution Westgate"},{"latitude":1.334289,"id":"34027409","longitude":103.741786,"name":"Fiesta Jurong"},{"latitude":1.3341704,"id":"246334718","longitude":103.7420863,"name":"Sync"},{"latitude":1.334243417,"id":"20073477","longitude":103.74214232,"name":"Jurong Concession Card Replacement Office"},{"latitude":1.334129566,"id":"264611132","longitude":103.742095153,"name":"Capitamall Jurong East"},{"latitude":1.33442906,"id":"318770120","longitude":103.742157144,"name":"Jurong East Int, Cw3 Bus Queue"},{"latitude":1.33421747,"id":"300010705","longitude":103.742184845,"name":"west gate"},{"latitude":1.334112651,"id":"197558853","longitude":103.742105645,"name":"Singtel Shop"},{"latitude":1.334317545,"id":"305126794","longitude":103.741711842,"name":"Jurong Island"},{"latitude":1.334092626,"id":"265842323","longitude":103.742083479,"name":"Koi Cafe - Westgate"},{"latitude":1.334516048,"id":"32776626","longitude":103.742103577,"name":"Capricciosa"},{"latitude":1.334106477,"id":"495110318","longitude":103.74180447,"name":"Contours Express Ladies Gym Jurong East"},{"latitude":1.3341283,"id":"504197146","longitude":103.7421403,"name":"4 Fingers Jurong East"},{"latitude":1.334233864,"id":"279984898","longitude":103.742213169,"name":"Jurong East Westgate"}]};

        /**
         * Query and store for each individual locaiton id
         * Need to wait for all promises
         * @param geoid
         * @param time in UNIX Timestamp
         * @param hour in UNIX Timestamp
         */
        function recentMedia(geoid, time, hour, flag) {
            var PIC = 30;
            var start = time-hour;
            var end = time+hour;
            var UPPER = Number.MAX_VALUE;
            var promises = [];
            sharedService.msg.length = 0; // clean  rather than reassign
            for(var i=0; i<geoid.data.length && i<UPPER; i++) {
                promises.push($http.jsonp(INST_API_URL+"/locations/"+geoid.data[i].id+"/media/recent"+
                "?access_token="+oauthService.getAccessToken()+
                "&min_timestamp="+start+
                "&max_timestamp="+end+
                "&callback=JSON_CALLBACK").success(function (data) {
                    if(data.data.length>0) {
                        sharedService.msg.push.apply(sharedService.msg, data.data);
                        sharedService.hour = hour;
                        // console.log(sharedService.msg);
                    }
                }));
            }

            // broadcasting
            $q.all(promises).then(function() {
                if(flag) {
                    if(sharedService.msg.length>PIC) {
                        sharedService.broadcastCount();
                        sharedService.broadcastItem();
                    }
                    else {
                        // increase the hour range to 
                        recentMedia(geoid, time, hour*4, flag);
                    }
                }
                else {
                    sharedService.broadcastItem();
                }
            });
        }
        return sharedService;
    }]);
})();