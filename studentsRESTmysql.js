let express = require('express');
let fs = require('fs');
let bodyParser = require('body-parser');
let Client = require('./studentMySQLDao');
let mysql = new Client();
let winston = require('winston');
let colors = require('colors');
colors.enabled = true;

// create express app
let app = express.Router();

// REST api calls for mysql version
//CREATE
app.post('/api/v1/students', function(req, res) {
    let data = req.body;
    mysql.create(data, function() {
        res.status(200).send('OK');
    })
});

//READ
app.get('/api/v1/students/:id.json', function(req, res) {
    let id = parseInt(req.params.id);
    mysql.read(id, function(student) {
        res.status(200).json(student);
    })
});

//UPDATE
app.put('/api/v1/students/:id.json', function(req, res){
    let id = parseInt(req.params.id);
    let data = req.body;
    mysql.update(id, data, function() {
        res.status(204).send('OK');
    })
});

//DELETE
app.delete('/api/v1/students/:id.json', function(req, res) {
    let id = parseInt(req.params.id);
    mysql.delete(id, function() {
        res.status(204).send('OK');
    })
});

//LIST
app.get('/api/v1/students.json', function(req, res) {
    mysql.list(function(students) {
        res.status(200).json(students);
    });
});

app.get('*', function(req, res) {
    res.status(404).sendFile(WEB + '/404.html');
});

exports = module.exports = app;