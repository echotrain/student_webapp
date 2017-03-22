/**
 * Created by josh on 3/16/2017.
 */

//TODO: angularize all the things...
let schoolYears = {
    1: "Freshman",
    2: "Sophomore",
    3: "Junior",
    4: "Senior"
}

angular.module('app').controller('studentController', function($scope, $mdDialog, studentSrv, $filter, $timeout) {

    //variables
    $scope.students = [];
    $scope.tableView = true;
    $scope.tileView = false;

    //AJAX json
    function init() {
        studentSrv.getStudents().then(function (result) {
            $scope.students = result.data;
            $scope.students.forEach(student => student.startDate = new Date(student.startDate));
        });
    }

    $scope.tileViewButton = function() {
        if(!$scope.tileView) {
            $scope.tableView = $scope.tileView;
            $scope.tileView = !$scope.tileView;
            Cookies.set('default', 'tiles');
        }
    };

    $scope.tableViewButton = function() {
        if(!$scope.tableView) {
            $scope.tileView = $scope.tableView;
            $scope.tableView = !$scope.tableView;
            Cookies.set('default', 'table');
        }
    };

    if (Cookies.get('default') == 'tile') {
        $scope.tileViewButton();
    }

    function getSchoolYear(year) {
        return schoolYears[year];
    }
    init();
});