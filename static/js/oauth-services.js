/**
 * Created by Danyang on 2/8/2015.
 */
(function() {
    var app = angular.module("oauth-services", []);

    /**
     * Connect to oauth.io
     */
    app.factory('oauthService', function($q) {
        var oauthService = false;
        return {
            initialize: function(appName) {
                //initialize OAuth.io with public key of the application
                OAuth.initialize('421nwYiF8fdQ56TiNC8QSn2gm-Q', {cache:true});
                //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
                oauthService = OAuth.create(appName);
            },
            isReady: function() {
                return (oauthService);
            },
            connect: function(appName) {
                var deferred = $q.defer();
                OAuth.popup(appName, {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
                    if (!error) {
                        oauthService = result;
                        deferred.resolve();
                    } else {
                        console.log("error in oauth");
                    }
                });
                return deferred.promise;
            },
            clearCache: function(appName) {
                OAuth.clearCache(appName);
                oauthService = false;
            },
            getAccessToken: function () {
                return oauthService.access_token;
            }
            //,
            ///**
            // * angularjs promise
            // * @returns promise
            // */
            //getLatestTweets: function () {
            //    //create a deferred object using Angular's $q service
            //    var deferred = $q.defer();
            //    var promise = oauthService.get('/1.1/statuses/home_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
            //        //when the data is retrieved resolved the deferred object
            //        deferred.resolve(data)
            //    });
            //    //return the promise of the deferred object
            //    return deferred.promise;
            //}
        }
    });
})();