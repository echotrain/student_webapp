angular.module('app').factory('studentSrv', function($http) {
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