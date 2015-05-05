'use strict';

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
