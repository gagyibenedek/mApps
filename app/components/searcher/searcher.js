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
                var minChars = parseInt(scope.minChars) || 1,
                    dirty = false;


                ele.bind('change keyup', function () {
                    if (ele.val().length >= minChars) {
                        console.log(ele.val())
                        scope.$apply(function() {
                            scope.resultList = appsFactory.searchForApps(ele.val());
                        });
                        if(!dirty) {
                            dirty = true;
                        }
                    } else if(ele.val().length === 0){
                        scope.resetList().then(function(apps){
                            console.log('ARRIVED');
                            if(ele.val().length === 0){
                                scope.resultList = apps;
                            }
                        });
                    }
                })
            }
        }

    }
]);