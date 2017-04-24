const Student = require('./server/student');
let winston = require('winston');
const mysql = require('mysql');
let nconf = require('nconf');
nconf.argv()
    .env()
    .file({file:'config.json'});
const host = nconf.get('host');
const user = nconf.get('user');
const pass = nconf.get('pass');

let connection = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
});
require('colors').enable = true;

connection.connect(function(err) {
    if (err) throw err;
    connection.query('CREATE DATABASE IF NOT EXISTS studentList', function(err, res) {
        if (err) throw err;
    });
});

let Client  =  function() {

}

Client.prototype.create = function(student, callback) {
    Student.sync().then(function() {
        Student.create(student).then(callback);
    });
};

Client.prototype.read = function(id, callback) {
    Student.findOne({where: {id: id}}).then(function(student) {
        callback(student);
    });
};

Client.prototype.update = function(id, student, callback) {
    Student.findOne({where: {id: id}}).then(function(studentModel) {
        studentModel.update(student).then(callback);
    });
};

Client.prototype.delete = function(id, callback) {
    Student.destroy({where: {id: id}}).then(callback);
};

Client.prototype.list = function(callback) {
    Student.sync().then(function() {
        Student.findAll().then(callback);
    });
};

exports = module.exports = Client;
