/**
 * Created by Danyang on 2/8/2015.
 */
(function() {
    var URL = 'https://graph.facebook.com/v2.2';
    var app = angular.module('picspective.facebook-controllers', []);

    app.controller('UrlShareController', [ function() {
        var vm = this;
        vm.post_url = {};
        vm.share = share;


        function share() {
            vm.post_url = window.location.href;
            console.log(vm.post_url);
            FB.ui({
                method: 'feed',
                link: vm.post_url,
                caption: 'Picspective Sharing'
            }, function(response){});
        }
    }]);

})();