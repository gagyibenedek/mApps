'use strict';

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
