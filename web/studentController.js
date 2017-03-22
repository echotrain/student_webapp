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

angular.module('app').controller('studentController', function($scope, $http, $mdDialog, studentSrv, $filter, $timeout) {

    //variables
    $scope.students = [];
    $scope.manifest = [];
    $scope.getStudentCalls = [];
    $scope.tableView = true;
    $scope.tileView = false;

    //AJAX json
    function init() {
        studentSrv.getStudents().then(function (result) {
            console.log(result.data); //testing
            for (let stu in result.data) {
                $scope.manifest.push(result.data[stu]);
                $scope.getStudentCalls.push($http.get(`/api/v1/students/${result.data[stu]}.json`)
                    .then(function (result) {
                        result.data.id = $scope.manifest[stu];
                        $scope.students.push(result.data);
                    }
                ));
            }
            console.log($scope.students); //testing
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