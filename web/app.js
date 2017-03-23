// code for the ng-app angular module 'app'
let app = angular.module('app', ['ngMaterial']);

app.factory('studentSrv', function($http) {
    studentService = {
        getStudents: function() {
            return $http.get('/api/v1/students.json');
        },
        updateStudent: function(updateStudent) {
            return $http.put(`/api/v1/students/${updateStudent.id}.json`, updateStudent);
        },
        addStudent: function(student) {
            return $http.post('api/v1/students.json', student);
        },
        deleteStudent: function(studentID) {
            return $http.delete(`/api/v1/students/${studentID}.json`);
        }
    };
    return studentService;
});

app.controller('studentController', function($scope, $http, $mdDialog, studentSrv, $filter, $timeout) {

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
        checkCookies();
    }

    $scope.tileViewButton = function() {
        if (!$scope.tileView) {
            $scope.tableView = $scope.tileView;
            $scope.tileView = !$scope.tileView;
            console.log("You clicked the tile view button..."); //testing
            Cookies.set('default', 'tiles');
        }
    };

    $scope.tableViewButton = function() {
        if (!$scope.tableView) {
            $scope.tileView = $scope.tableView;
            $scope.tableView = !$scope.tableView;
            console.log("You clicked the table view button..."); //testing
            Cookies.set('default', 'table');
        }
    };

    function checkCookies() {
        console.log("The Cookies check executed!..."); //testing
        if (Cookies.get('default') == 'tiles') {
            console.log("... and you want those sweet sweet tiles."); //testing
            $scope.tileViewButton();
        }
    }
    init();
});

app.directive('studentTable', () => {
    return { templateUrl: 'student-table.html' }
});

app.directive('studentTile', () => {
    return { templateUrl: 'student-tile.html' }
});

app.filter('getSchoolYear', () => {
    return year => {
        if (year === 1) return 'Freshman';
        if (year === 2) return 'Sophomore';
        if (year === 3) return 'Junior';
        if (year === 4) return 'Senior';
        return year;
    }
});