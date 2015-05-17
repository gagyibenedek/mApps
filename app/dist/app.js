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

        appFactory.searchForApps = function(search){
          var results = [],
              i = apps.length;

            while(i--){
                if(apps[i].name.toLowerCase().indexOf(search) !== -1){
                    results.push(apps[i]);
                }
            }

            return results;
        };

        appFactory.getBatchOfApps = function (from, until) {
            //simulate roundtrip time
            return $timeout(function () {
                var i, app, newApp, batch = [],
                    batchSize = until - from;
                if(from === 0){
                    //add custom apps only once
                    batch = customApps.concat([]);
                }
                for (i = 0; i < batchSize; i++) {
                    app = apps[Math.floor(Math.random() * 10)];
                    newApp = {
                        name: ' #' + (from + i) + app.name, //numbers added to names to ease identification
                        users: app.users,
                        username: app.username,
                        password: app.password,
                        notes: app.notes,
                        organization: app.organization,
                        color: app.color,
                        letter: app.name[0]
                    };
                    batch.push(newApp);
                }

                return batch;
            }, (until-from)*10);
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
});;'use strict';

angular.module('meldium').directive('scroller',
    function ($window, $document) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                var viewPort,
                    lastOffset = 0,
                    page = 0,
                    pagingConstant = 3;

                angular.element($window).bind("scroll", function () {
                    page = Math.floor($document[0].body.clientHeight / viewPort);
                    viewPort = $window.innerHeight;

                    if (lastOffset < this.pageYOffset) { //scroll down
                        if ($document[0].body.clientHeight - this.pageYOffset < viewPort * pagingConstant) {
                            scope.pageBottom();
                        }

                        if (this.pageYOffset > viewPort * pagingConstant) {
                            scope.removeFromTop();
                        }
                    } else if (lastOffset > this.pageYOffset) { //scroll up
                        if (this.pageYOffset === 0) {
                            scope.pageAllTheWayTop();
                        } else if (this.pageYOffset < viewPort * pagingConstant) {
                            scope.pageTop();
                        }

                        if ($document[0].body.clientHeight - this.pageYOffset > viewPort * pagingConstant) {
                            scope.removeFromBottom();
                        }
                    }

                    lastOffset = this.pageYOffset;
                });
            }
        }
    }
);;'use strict';

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