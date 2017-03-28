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

app.controller('studentController', function($scope, studentSrv, $http, $mdDialog, $filter, $timeout) {

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
    $scope.deletedStudents = [];
    $scope.getStudentCalls = [];
    $scope.tableView = true;
    $scope.tileView = false;
    $scope.dialogType = '';
    $scope.sortType = 'name';
    $scope.reverse = true;
    const LOAD_TIME = 1000;

    //AJAX json of student data
    function init() {
        studentSrv.getStudents().then(function (result) {
            for (let stu in result.data) {
                $scope.manifest.push(result.data[stu]);
                $scope.getStudentCalls.push($http.get(`/api/v1/students/${result.data[stu]}.json`)
                    .then(function(result) {
                        result.data.id = $scope.manifest[stu];
                        result.data.startDate = new Date(result.data.startDate);
                        $scope.students.push(result.data);
                    }
                ));
            }
        });
        $scope.checkCookies();
    }

    $scope.tileViewButton = function() {
        if (!$scope.tileView) {
            $scope.tableView = $scope.tileView;
            $scope.tileView = !$scope.tileView;
            Cookies.set('default', 'tiles');
        }
    };

    $scope.tableViewButton = function() {
        if (!$scope.tableView) {
            $scope.tileView = $scope.tableView;
            $scope.tableView = !$scope.tableView;
            Cookies.set('default', 'table');
        }
    };

    $scope.checkCookies = function() {
        if (Cookies.get('default') === 'tiles') {
            $scope.tileViewButton();
        }
    };
    init();

    $scope.close = function() {
        $scope.selectedStudent = {};
        $mdDialog.cancel();
    };

    $scope.setDialogType = function(type) {
        $scope.dialogType = type;
    };

    $scope.getStudent = function(_id) {
        $scope.selectedStudent = $scope.students.find(function(student) {
            return student.id === _id;
        });
        if ($scope.dialogType === 'Info') {
            $scope.popInfoDialog();
        }
        else if ($scope.dialogType === 'Edit') {
            $scope.popFormDialog();
        }
        else if ($scope.dialogType === 'Delete') {
            $scope.popDeleteDialog();
        }
    };

    $scope.submit = function() {
        if ($scope.dialogType === 'Add') {
            $scope.addStudentSubmit();
        }
        else if ($scope.dialogType === 'Edit') {
            $scope.editStudentSubmit();
        }
        else if ($scope.dialogType === 'Delete') {
            $scope.deletedStudents.push($scope.selectedStudent);
            $scope.deleteStudentSubmit();
        }
        else if ($scope.dialogType === 'Restore') {
            $scope.deletedStudents = $filter('filter')($scope.deletedStudents, function(stu) {
                return stu.id !== $scope.selectedStudent.id;
            });
            $scope.addStudentSubmit();
        } else {
            alert('Unexpected error occurred. Try again.');
            $scope.close();
        }
    };

    $scope.popInfoDialog = function($event) {
        $mdDialog.show({
            contentElement: '#infoDialog',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
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

    $scope.popRestoreDialog = function($event) {
        $mdDialog.show({
            contentElement: '#restoreDialog',
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
            $scope.reverse = (sortType !== null && angular.equals($scope.sortType, sortType)) ? !$scope.reverse : false;
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