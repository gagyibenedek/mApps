'use strict';

angular.module('meldium').directive('searcher', ['appsFactory',
    function (appsFactory) {
        return {
            restrict: 'A',
            scope: {
                resultList: '=',
                resetList: '&',
                minChars: '@'
            },
            link: function (scope, ele, attr) {
                var minChars = parseInt(scope.minChars) || 1;

                ele.bind('change keyup', function () {
                    if (ele.val().length >= minChars) {
                        scope.$apply(function() {
                            scope.resultList = appsFactory.searchForApps(ele.val());
                        });

                    } else if(ele.val().length === 0){
                        scope.resultList.splice(0, scope.resultList.length);
                        scope.resetList();
                    }
                })
            }
        }

    }
]);