'use strict';

var app = angular.module('meldium', []);

app.controller('MainController', ['$scope', 'appsFactory',
    function ($scope, appsFactory) {
        $scope.total = appsFactory.getAppCount();

        appsFactory.getBatchOfApps(0,50).then(function (apps) {
            $scope.apps = apps;
        });

        $scope.search = '';
        $scope.showNewApp = false;

        $scope.saveNewApp = function (name, color) {
            $scope.apps = [];
            $scope.showNewApp = false;

            appsFactory.saveNewApp(name, color).then(function(apps){
                $scope.apps = apps;
            });
        };

        $scope.addNewApp = function(){
            $scope.showNewApp = true;
        }

        $scope.cancelNewApp = function () {
            $scope.showNewApp = false;
        }

    }
]);
