//generate student ids
var fs = require('fs');
const ID_SIZE = 4;

function idFiller(number, spaces) {
    var id = `${number}`;
    while (id.length < spaces) {
        id = '0' + id;
    }
    return id;
}

function* generateID() {
    var startID = 1;
    while (true) {
        yield idFiller(startID++, ID_SIZE);
    }
}
var getID = generateID();



console.log("Generate ID for each student in the given JSON.");

var fileName = process.argv[2];
console.log(fileName);
var students = JSON.parse(fs.readFileSync(fileName, 'utf8'));

//loop through all students in the json and generate their id
for (var s in students) {
    students[s].id = getID.next().value;
}

//overwrite the JSON file with the new
fs.writeFile(fileName, JSON.stringify(students, null, '\t'), 'utf8');

console.log('done');