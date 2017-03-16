// =========================== SORTING FUNCTIONS =========================== //

// returns the name of the sort function to be called given data type
let sortFunctions = {
    'year' : compareNumbers,
    'startDate' : compareDates,
    'street' : compareStrings,
    'city' : compareStrings,
    'state' : compareStrings,
    'zip' : compareNumbers,
    'phone' : compareStrings
};

function sortStudentData(index) {
    
    students.sort(function(studentA, studentB) {
        // if sorting by first or last name, apply special secondary sort function
        if (index === 'lname' || index === 'fname') {
            return compareNames(studentA, studentB, index);
        }
        // gets the proper sort function based on the index key
        return sortFunctions[index](studentA[index], studentB[index]);
    });
    
}

// number comparison
function compareNumbers(numA, numB) {
    return numA - numB;
}

// string comparisons
function compareStrings(stringA, stringB) {
    
    let firstWord = stringA.toLowerCase();
    let secondWord = stringB.toLowerCase();
    
    if (firstWord < secondWord) {
        return -1;
    }
    if (firstWord > secondWord) {
        return 1;
    }
    // strings are equal
    return 0;
}

// date comparisons
function compareDates(dateA, dateB) {
    return new Date(dateA).getTime() - new Date(dateB).getTime();
}

// name comparisons (does secondary sort)
function compareNames(nameA, nameB, index) {
    
    // determine secondary sort value
    let secondarySort = (index === 'lname') ? 'fname' : index;
    
    if (nameA[index].toLowerCase() === nameB[index].toLowerCase()) {
        // apply secondary sort if names are equal at the current index
        return compareStrings(nameA[secondarySort], nameB[secondarySort]);
    }
    return compareStrings(nameA[index], nameB[index]);
}