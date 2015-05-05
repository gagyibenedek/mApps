'use strict';

var app = angular.module('meldium', []);

app.controller('MainController', ['$scope', 'appsFactory',
    function ($scope, appsFactory) {
        $scope.total = appsFactory.getAppCount();

        appsFactory.getBatchOfApps(0, 50).then(function (apps) {
            $scope.apps = apps;
        });

        $scope.search = '';
        $scope.showNewApp = false;

        $scope.saveNewApp = function (name, color) {
            name = name.trim();
            if (name !== '') {
                $scope.apps = [];

                appsFactory.saveNewApp(name, color).then(function (apps) {
                    $scope.apps = apps;
                });
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

        $scope.openAppDetails = function(index) {
            $scope.appWithDetails = $scope.apps[index];
            $scope.showAppDetails = true;
        }

        $scope.closeAppDetails = function() {
            $scope.showAppDetails = false;
        }

    }
]);
