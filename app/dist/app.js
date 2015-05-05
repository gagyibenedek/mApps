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
;'use strict';

angular.module('meldium')
    .factory('appsFactory',
    function ($timeout) {
        var appFactory = {},
        //I made the assumption regarding the passwords, that the API serves simple **** strings, and handles new passwords (e.g. if the new value != ****)
            apps = [
                {name: 'Sucuri', users: 1000, username: '', password: '********', notes: '', organization: '', color: 0},
                {name: 'Wave', users: 1001, username: '', password: '********', notes: '', organization: '', color: 1},
                {name: 'Experts Exchange', users: 1002, username: '', password: '********', notes: '', organization: '', color: 2},
                {name: 'OpenCart Admin', users: 1003, username: '', password: '********', notes: '', organization: '', color: 3},
                {name: 'FreeDNS (Afraid.org)', users: 1004, username: '', password: '********', notes: '', organization: '', color: 4},
                {name: 'Uptime Robot', users: 1005, username: '', password: '********', notes: '', organization: '', color: 5},
                {name: 'Acclaro', users: 1006, username: '', password: '********', notes: '', organization: '', color: 6},
                {name: 'Simply Measured', users: 1007, username: '', password: '********', notes: '', organization: '', color: 7},
                {name: 'Compass', users: 1008, username: '', password: '********', notes: '', organization: '', color: 8},
                {name: 'StartupJobs (Asia) really long name', users: 1009, username: '', password: '********', notes: '', organization: '', color: 9}
            ],
        //this var is needed only to bridge the limits of the mocking: wee need to store the custom apps added in a session by the user
            customApps = [];

        appFactory.getAppCount = function () {
            //get the total number of apps
            return 2016;
        };

        appFactory.getBatchOfApps = function (from, until) {
            //simulate roundtrip time
            return $timeout(function () {
                var i, app, batch = [],
                    batchSize = until - from;
                batch = customApps.concat([]);
                for (i = 0; i < batchSize; i++) {
                    app = apps[Math.floor(Math.random() * 10)];
                    app.letter = app.name[0];
                    batch.push(app);
                }

                return batch;
            }, 1000);
        };

        appFactory.saveNewApp = function(name, color){
            var app = {name: name, users: 1000+color, username: '', password: '********', notes: '', organization: '', color: color, letter: name[0]};
            customApps.unshift(app);

            return appFactory.getBatchOfApps(0, 50);
        }

        return appFactory;
    }
);
;'use strict';

angular.module('meldium').directive('appBox', function () {
    return {
        restrict: 'AE',
        scope: {
            app: '=',
            index: '@'
        },
        templateUrl: 'app/components/appBox/appBox.tpl.html',
        replace: true,
        link: function (scope, ele, attr) {
            scope.users = scope.app.users === 1 ? 'user' : 'users';
        }
    }
});;'use strict';

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