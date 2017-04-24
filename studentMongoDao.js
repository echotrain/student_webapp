//CRUDL for tasks stored on MongoDB

let mongo = require('mongodb').MongoClient;
let nconf = require('nconf');
let winston = require('winston');
require('colors').enable = true;
nconf.argv()
    .env()
    .file({file:'config.json'});

const URL = nconf.get('mongo-url');

let Client = function() {};

function getNextSequence(db, callback) {
    db.collection('counters').findAndModify({ _id: 'id' }, {}, { $inc: { seq: 1 } }, {new: true}).then(function (ret) {
        if (ret.value) {
            callback(ret.value.seq);
        } else {
            db.collection('counters').insertOne({_id: 'id', seq: 0}).then(function(err) {
                if (err) winston.error(`${err}`.red);
                else {
                    db.collection('counters').findAndModify({_id: 'id'}, {}, {$inc: {seq: 1}}, {new: true}).then(function (ret) {
                        callback(ret.value.seq);
                    });
                }
            });
        }
    });
}

Client.prototype.connect = function(callback) {
    mongo.connect(URL, function(err, db) {
        if (err) winston.error(`${err}`.red);
        else callback(db);
    });
};

Client.prototype.create = function create(db, student, callback) {
    getNextSequence(db, function(id) {
        student.id = id;
        callback(db.collection('students').insertOne(student));
    });
};

Client.prototype.read = function (db, id, callback) {
    db.collection('students').findOne({id: id}, function(err, res) {
        if (err) winston.error(`${err}`.red);
        else {
            delete res['_id'];
            callback(res);
        }
    });
};

Client.prototype.update = function (db, id, student, callback) {
    db.collection('students').updateOne({id: id}, student, function(err, res) {
        if (err) winston.error(`${err}`.red);
        else callback();
    });
};

Client.prototype.delete = function(db, id, callback) {
    return db.collection('students').deleteOne({id: id}, function(err, res) {
        if (err) winston.error(`${err}`.red);
        else callback();
    });
};

Client.prototype.list = function(db, callback) {
    db.collection('students').find().toArray().then(function(res) {
        res.forEach(student => delete student['_id']);
        callback(res);
    });
};

exports = module.exports = Client;
