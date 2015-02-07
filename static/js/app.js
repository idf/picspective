/**
 * Created by Danyang on 2/7/2015.
 */
(function(){
    'use strict';

    angular.module('picspective', [
        /* Shared Modules */
        'filters',

        /* Feature ares */
        'picspective.search-controllers',
        'picspective.search-directives',
        'picspective.selection-controllers',
        'picspective.selection-directives',
        //'picspective.share-controllers',
        //'picspective.share-directives'
    ]);
})();