// load modules
var fs = require('fs');

// execute
console.log('Splitting students.json file into individual student files.');

var fileName = process.argv[2];
var students = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for (var stu in students) {
    var studentID = students[stu].id;
    delete students[stu].id;
    fs.writeFile(`students/${studentID}.json`, JSON.stringify(students[stu], null, '\t'), 'utf8');
}

console.log("Complete.");