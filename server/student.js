const Sequelize = require('sequelize');
let nconf = require('nconf');
nconf.argv()
    .env()
    .file({file:'config.json'});

const URL = nconf.get('mysql-url');
let sequelize = new Sequelize(URL);

let Student = sequelize.define('student', {
    "id": { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    "fname": { type: Sequelize.STRING },
    "lname": { type: Sequelize.STRING },
    "startDate": { type: Sequelize.DATE },
    "street": { type: Sequelize.STRING },
    "city": { type: Sequelize.STRING },
    "state": { type: Sequelize.STRING(2) },
    "zip": { type: Sequelize.INTEGER },
    "phone": { type: Sequelize.STRING },
    "year": { type: Sequelize.INTEGER }
});

exports = module.exports = Student;