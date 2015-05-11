'use strict';

var app = angular.module('meldium', ['infinite-scroll']);

app.controller('MainController', ['$scope', 'appsFactory',
    function ($scope, appsFactory) {
        var cursor = 0,
            pageSize = 50;

        $scope.getFirstBatch = function () {
            return appsFactory.getBatchOfApps(0, pageSize);
        }

        $scope.resetAppList = function () {
            $scope.getFirstBatch().then(function (apps) {
                cursor = pageSize;
                $scope.apps = apps;
            });
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

        $scope.paging = function () {
            appsFactory.getBatchOfApps(cursor, cursor + pageSize).then(function (batch) {
                $scope.apps = $scope.apps.concat(batch);
                cursor += pageSize;
            });
        }


    }
]);
