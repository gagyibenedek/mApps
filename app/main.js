'use strict';

var app = angular.module('meldium', []);

app.controller('MainController', ['$scope', 'appsFactory', '$window', '$document',
    function ($scope, appsFactory, $window, $document) {
        var cursor,
            tail = 0,
            pageSize = 0;

        $scope.allTheWayInProgress = false;

        $scope.pagingInProgress = false;

        $scope.apps = [];

        function getFirstBatch() {
            appsFactory.getBatchOfApps(pageSize, pageSize + 10).then(function (apps) {
                var page = Math.floor($document[0].body.clientHeight / $window.innerHeight);
                $scope.apps = $scope.apps.concat(apps);
                pageSize += 10;
                cursor = pageSize;

                if (page < 2) {
                    getFirstBatch();
                }
            });
        }

        $scope.resetAppList = function () {
            tail = 0;
            pageSize = 0;
            getFirstBatch();
        }

        $scope.removeFromTop = function () {
            $scope.$apply(function () {
                $scope.apps = $scope.apps.slice(pageSize);
                tail += pageSize;
                console.log('Remove from top', tail);
            });
        }

        $scope.removeFromBottom = function () {
            if (cursor > pageSize * 2) {
                $scope.$apply(function () {
                    $scope.apps = $scope.apps.slice(0, $scope.apps.length - pageSize);
                    cursor -= pageSize;
                    console.log('Removed from bottom', cursor);
                });
            }
        }

        $scope.pageTop = function () {
            var from = tail - pageSize,
                until = tail;
            if (from >= 0) {
                page(from, until, false);
            }
        }

        $scope.pageAllTheWayTop = function () {
            if (tail > 0) {
                $scope.pagingInProgress = true;
                $scope.allTheWayInProgress = true;

                //we only need the first 2 pages
                appsFactory.getBatchOfApps(0, pageSize * 2).then(function (batch) {
                    $scope.apps = batch;
                    $scope.pagingInProgress = false;
                    $scope.allTheWayInProgress = false;

                    cursor = pageSize * 2;
                    tail = 0;

                    console.log('Paged all the way to the top');
                });
            }
        }

        $scope.pageBottom = function () {
            var from = cursor,
                until = cursor + pageSize;
            page(from, until, true);
        }

        function page(from, until, bottomPaging) {
            if (!$scope.pagingInProgress && !$scope.allTheWayInProgress) {
                $scope.pagingInProgress = true;

                appsFactory.getBatchOfApps(from, until).then(function (batch) {
                    if (bottomPaging) {
                        $scope.apps = $scope.apps.concat(batch);
                        cursor = until;
                        console.log('Paged bottom', cursor);
                    } else {
                        $scope.apps = batch.concat($scope.apps);
                        tail = from;
                        console.log('Paged top', tail);
                    }
                    $scope.pagingInProgress = false;
                });
            }
        }


        $scope.total = appsFactory.getAppCount();

        $scope.resetAppList();

        $scope.search = '';
        $scope.showNewApp = false;

        $scope.saveNewApp = function (name, color) {
            name = name.trim();
            if (name !== '') {
                $scope.apps = [];

                if (appsFactory.saveNewApp(name, color)) {
                    $scope.resetAppList();
                }
            }
            $scope.showNewApp = false;
        };

        $scope.addNewApp = function () {
            $scope.showNewApp = true;
        }

        $scope.cancelNewApp = function () {
            $scope.showNewApp = false;
        }

        $scope.showAppDetails = false;
        $scope.appWithDetails = {};

        $scope.openAppDetails = function (index) {
            $scope.appWithDetails = $scope.apps[index];
            $scope.showAppDetails = true;
        }

        $scope.closeAppDetails = function () {
            $scope.showAppDetails = false;
        }

    }
]);
