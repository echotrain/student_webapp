//CRUDL for tasks stored on MongoDB

let mongo = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
const URL = `mongodb://${process.env.IP}`;

exports.create = function(err, id){

};

exports.read = function(id, next) {
    mongo.connect(URL, function(err, db) {
        if (err) return next(err, null);

        db.collection('students').findOne({ _id: new ObjectID(id)}, {}, function(err, result) {
            //if (err) throw err;
            console.log('in read()');
            console.log(result);
            next(err, result);
            db.close();
        });
    });
};

exports.read(id, function(err, student) {
    if (err) throw err;

    console.log('in next()');
    console.log(student);
});

exports.update = function(err) {

};

exports.delete = function(err) {

};