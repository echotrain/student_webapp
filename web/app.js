// ng-app directive for root angular module application ('app')
let app = angular.module('app', ['ngMaterial']);

app.factory('studentSrv', function($http) {
    studentService = {
        getStudents: function() {
            return $http.get('/api/v1/students.json');
        },
        addStudent: function(student) {
            return $http.post('api/v1/students.json', student);
        },
        editStudent: function(editStudent) {
            return $http.put(`/api/v1/students/${editStudent.id}.json`, editStudent);
        },
        deleteStudent: function(deleteStudent) {
            return $http.delete(`/api/v1/students/${deleteStudent.id}.json`);
        }
    };
    return studentService;
});

app.controller('studentController', function($scope, $http, $mdDialog, studentSrv, $filter, $timeout) {

    //variables
    $scope.years = [1, 2, 3, 4];
    $scope.states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
    $scope.selectedStudent = {};
    $scope.students = [];
    $scope.manifest = [];
    $scope.getStudentCalls = [];
    $scope.tableView = true;
    $scope.tileView = false;
    $scope.formType = '';
    $scope.sortType = 'name';
    $scope.reverse = true;
    const LOAD_TIME = 1000;

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
        $scope.checkCookies();
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

    $scope.checkCookies = function() {
        console.log('The Cookies check executed!!!'); //testing
        if (Cookies.get('default') === 'tiles') {
            console.log("... and you want those sweet sweet tiles."); //testing
            $scope.tileViewButton();
        }
    };
    init();

    $scope.close = function() {
        $scope.selectedStudent = {};
        $mdDialog.cancel();
    };

    $scope.setFormType = function(type) {
        $scope.formType = type;
    };

    $scope.submit = function() {
        if ($scope.formType === 'Add') {
            $scope.addStudentSubmit();
        }
        else if ($scope.formType === 'Edit') {
            $scope.editStudentSubmit();
        }
        else if ($scope.formType === 'Delete') {
            $scope.deleteStudentSubmit();
        } else {
            alert('Unexpected error occurred. Try again.');
        }
    };

    $scope.requestStudent = function(id) {
        $http.get(`/api/v1/students/${id}.json`).then(function (result) {
            result.data.id = id;
            result.data.startDate = new Date(result.data.startDate);
            $scope.selectedStudent = result.data;
            console.log('requestStudent function has executed!!!'); //testing
            console.log($scope.selectedStudent); //testing
            if ($scope.formType !== 'Delete') {
                $scope.popFormDialog();
            } else {
                $scope.popDeleteDialog();
            }
        });
    };

    $scope.popFormDialog = function($event) {
        $mdDialog.show({
            contentElement: '#formDialog',
            parent: angular.element(document.body),
            targetEvent: $event
        });
    };

    $scope.popDeleteDialog = function($event) {
        $mdDialog.show({
            contentElement: '#deleteDialog',
            parent: angular.element(document.body),
            targetEvent: $event
        });
    };

    $scope.sortBy = function(sortType) {
        $mdDialog.show({
            contentElement: '#loadingDialog',
            parent: angular.element(document.body),
            escapeToClose: false
        }).then($timeout(function() {
            $scope.reverse = (sortType !== null && $scope.sortType === sortType) ? !$scope.reverse : false;
            $scope.sortType = sortType;
            $scope.students = $filter('orderBy')($scope.students, $scope.sortType, $scope.reverse);
            $mdDialog.hide();
        }, LOAD_TIME));
    };

    $scope.addStudentSubmit = function() {
        $scope.selectedStudent.startDate = $filter('date')($scope.selectedStudent.startDate, 'shortDate');
        console.log('addStudentSubmit has executed!!!'); //testing
        console.log($scope.selectedStudent); //testing
        //testing
        // studentSrv.addStudent($scope.selectedStudent).then(function() {
        //     init();
        // });
        $scope.close();
    };

    $scope.editStudentSubmit = function() {
        $scope.selectedStudent.startDate = $filter('date')($scope.selectedStudent.startDate, 'shortDate');
        console.log('editStudentSubmit has executed!!!'); //testing
        console.log($scope.selectedStudent); //testing
        //testing
        // studentSrv.editStudent($scope.selectedStudent).then(function() {
        //     init();
        // });
        $scope.close();
    };

    $scope.deleteStudentSubmit = function() {
        console.log('deleteStudentSubmit has executed!!!'); //testing
        console.log($scope.selectedStudent); //testing
        //testing
        // studentSrv.deleteStudent($scope.selectedStudent).then(function() {
        //     init();
        // });
        $scope.close();
    };

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