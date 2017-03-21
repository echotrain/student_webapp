/**
 * Created by josh on 3/16/2017.
 */

//TODO: angularize all the things...
angular.module('app').controller('studentController', function($scope, $mdDialog, studentSrv, $filter, $timeout) {

    //variables
    $scope.students = [];

    //AJAX json
    function init() {
        studentSrv.getStudents().then(function (result) {
            $scope.students = result.data;

        });
    }


});