'use strict';

angular.module('meldium').directive('newApp', function () {
    return {
        restrict: 'AE',
        scope: {
            saveNewApp: '&',
            cancel: '&'
        },
        templateUrl: 'app/components/newApp/newApp.tpl.html',
        replace: true,
        link: function (scope, ele, attr) {
            var saveMethod = scope.saveNewApp();
            scope.name = '';
            scope.color =  Math.floor(Math.random() * 10);

            scope.saveApp = function(){
                saveMethod(scope.name, scope.color);
            }
        }
    }
});