'use strict';

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
);