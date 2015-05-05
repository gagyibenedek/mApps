'use strict';

angular.module('meldium').directive('appDetails', ['organizationFactory',
    function (organizationFactory) {
        return {
            restrict: 'AE',
            scope: {
                app: '=',
                close: '&'
            },
            templateUrl: 'app/components/appDetails/appDetails.tpl.html',
            replace: true,
            link: function (scope, ele, attr) {
                scope.open = 'details-open';

                scope.organizations = organizationFactory.getOrganizations();
            }
        }
    }]);