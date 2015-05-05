/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;mod=angular.module("infinite-scroll",[]),mod.directive("infiniteScroll",["$rootScope","$window","$timeout",function(i,n,e){return{link:function(t,l,o){var r,c,f,a;return n=angular.element(n),f=0,null!=o.infiniteScrollDistance&&t.$watch(o.infiniteScrollDistance,function(i){return f=parseInt(i,10)}),a=!0,r=!1,null!=o.infiniteScrollDisabled&&t.$watch(o.infiniteScrollDisabled,function(i){return a=!i,a&&r?(r=!1,c()):void 0}),c=function(){var e,c,u,d;return d=n.height()+n.scrollTop(),e=l.offset().top+l.height(),c=e-d,u=n.height()*f>=c,u&&a?i.$$phase?t.$eval(o.infiniteScroll):t.$apply(o.infiniteScroll):u?r=!0:void 0},n.on("scroll",c),t.$on("$destroy",function(){return n.off("scroll",c)}),e(function(){return o.infiniteScrollImmediateCheck?t.$eval(o.infiniteScrollImmediateCheck)?c():void 0:c()},0)}}}]);;'use strict';

var app = angular.module('meldium', ['infinite-scroll']);

app.controller('MainController', ['$scope', 'appsFactory',
    function ($scope, appsFactory) {
        var cursor = 0,
            pageSize = 50;

        function resetAppList() {
            appsFactory.getBatchOfApps(0, pageSize).then(function (apps) {
                cursor = pageSize;
                $scope.apps = apps;
            });
        }

        $scope.total = appsFactory.getAppCount();

        resetAppList();

        $scope.search = '';
        $scope.showNewApp = false;

        $scope.saveNewApp = function (name, color) {
            name = name.trim();
            if (name !== '') {
                $scope.apps = [];

                if (appsFactory.saveNewApp(name, color)) {
                    resetAppList();
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
            console.log(cursor, cursor + pageSize);

            appsFactory.getBatchOfApps(cursor, cursor + pageSize).then(function (batch) {
                $scope.apps = $scope.apps.concat(batch);
                cursor += pageSize;
            });
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
                if(from === 0){
                    //add custom apps only once
                    batch = customApps.concat([]);
                }
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

            return true;
        }

        return appFactory;
    }
);
;'use strict';

angular.module('meldium')
    .factory('organizationFactory',
    function ($timeout) {
        var organizationFactory = {},
            orgs = [
                {val: "org1", text: "Org 1"},
                {val: "org2", text: "Org 2"},
                {val: "org3", text: "Org 3"},
                {val: "org4", text: "Org 4"},
                {val: "org5", text: "Org 5"}
            ];

        organizationFactory.getOrganizations = function () {
            return orgs;
        };

        return organizationFactory;
    }
);
;'use strict';

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
});;'use strict';

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
    }]);;'use strict';

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