// load modules
let fs = require('fs');

// execute
console.log('Splitting students.json file into individual student files.');

let fileName = process.argv[2];
let students = JSON.parse(fs.readFileSync(fileName, 'utf8'));

for (let stu in students) {
    let studentID = students[stu].id;
    delete students[stu].id;
    fs.writeFile(`../students/${studentID}.json`, JSON.stringify(students[stu], null, '\t'), 'utf8');
}

console.log("Complete.");