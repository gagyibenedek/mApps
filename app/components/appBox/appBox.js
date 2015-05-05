'use strict';

angular.module('meldium').directive('appBox', function () {
    return {
        restrict: 'AE',
        scope: {
            app: '=',
            index: '@',
            openDetails: '&'
        },
        templateUrl: 'app/components/appBox/appBox.tpl.html',
        replace: true,
        link: function (scope, ele, attr) {
            scope.users = scope.app.users === 1 ? 'user' : 'users';
            scope.detailsMethod = scope.openDetails();

            scope.openAppDetails = function(){
                scope.detailsMethod(scope.index);
            }
        }
    }
});