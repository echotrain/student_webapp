angular.module('app').directive('studentTable', function() {
    return {
        templateUrl: '/student-table/student-table.html',
        restrict: 'E',
        scope: {
            student: '='
        },
        link: function(scope, elem, attrs) {}
    }
});