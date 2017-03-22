angular.module('app').directive('studentTile', function() {
    return {
        templateUrl: '/student-tile/student-tile.html',
        restrict: 'E',
        scope: {
            student: '='
        },
        link: function(scope, elem, attrs) {}
    }
});