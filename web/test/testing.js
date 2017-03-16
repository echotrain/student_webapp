// JavaScript File (Jasmine Testing)
/* global expect */
// unit tests

describe("getSchoolYear(grade)", function() {
    
    it("should return undefined for numbers out of bounds", function() {
        expect(getSchoolYear(0)).toBe(undefined);
        expect(getSchoolYear(5)).toBe(undefined);
        expect(getSchoolYear(22)).toBe(undefined);
    });
    
    it("and should return 'Freshman' for year 1", function() {
        expect(getSchoolYear(1)).toBe("Freshman");
    });
    
    it("and should return 'Sophomore' for year 2", function() {
        expect(getSchoolYear(2)).toBe("Sophomore");
    });
    
    it("and should return 'Junior' for year 3", function() {
        expect(getSchoolYear(3)).toBe("Junior");
    });
    
    it("and should return 'Senior' for year 4", function() {
        expect(getSchoolYear(4)).toBe("Senior");
    });
    
});

describe("compareNumbers(numA, numB)", function() { //suite
    
    it("should return 0 if the two numbers are the same", function() { //spec
        expect(compareNumbers(0, 0)).toBe(0); //expectation
        expect(compareNumbers(1, 1)).toBe(0);
        expect(compareNumbers(-1, -1)).toBe(0);
        expect(compareNumbers(0.1, .1)).toBe(0);
        expect(compareNumbers(10000001, 10000001)).toBe(0);
        expect(compareNumbers(23.5, 23.5)).toBe(0);
    });

    it("and should return positive number if first number is bigger", function() {
        expect(compareNumbers(1, 0)).toBeGreaterThan(0);
        expect(compareNumbers(1.0, .5)).toBeGreaterThan(0);
        expect(compareNumbers(-1, -4)).toBeGreaterThan(0);
        expect(compareNumbers(0.1, 0.0)).toBeGreaterThan(0);
        expect(compareNumbers(10000001, 10000000)).toBeGreaterThan(0);
        expect(compareNumbers(23.51, 23.5)).toBeGreaterThan(0);
    });

    it("and should return negative number if first number is smaller", function() {
        expect(compareNumbers(0, 1)).toBeLessThan(0);
        expect(compareNumbers(.5, 1.0)).toBeLessThan(0);
        expect(compareNumbers(-4, -1)).toBeLessThan(0);
        expect(compareNumbers(0.0, 0.1)).toBeLessThan(0);
        expect(compareNumbers(10000000, 10000001)).toBeLessThan(0);
        expect(compareNumbers(23.5, 23.51)).toBeLessThan(0);
    });
});

describe("compareStrings(stringA, stringB)", function() {
    
    it("should return 0 if the two strings are the same", function() {
        expect(compareStrings("apple", "apple")).toBe(0);
        expect(compareStrings("z", "z")).toBe(0);
        expect(compareStrings("Bravo", "Bravo")).toBe(0);
        expect(compareStrings("CAT", "CAT")).toBe(0);
        expect(compareStrings("a b c d e f", "a b c d e f")).toBe(0);
        expect(compareStrings("DeLtA", "dElTa")).toBe(0);
    });

    it("and should return positive number if first string should come after", function() {
        expect(compareStrings("b", "a")).toBeGreaterThan(0);
        expect(compareStrings("dog", "cat")).toBeGreaterThan(0);
        expect(compareStrings("xyz", "abc")).toBeGreaterThan(0);
        expect(compareStrings("ZED", "ALPHA")).toBeGreaterThan(0);
        expect(compareStrings("Josh", "Frank")).toBeGreaterThan(0);
        expect(compareStrings("Shepard", "Anderson")).toBeGreaterThan(0);
    });

    it("and should return negative number if first string should come first", function() {
        expect(compareStrings("a", "b")).toBeLessThan(0);
        expect(compareStrings("cat", "dog")).toBeLessThan(0);
        expect(compareStrings("abc", "xyz")).toBeLessThan(0);
        expect(compareStrings("ALPHA", "ZED")).toBeLessThan(0);
        expect(compareStrings("Frank", "Josh")).toBeLessThan(0);
        expect(compareStrings("Anderson", "Shepard")).toBeLessThan(0);
    });
});

describe("compareDates(dateA, dateB)", function() {
    
    it("should return 0 if the two dates are the same", function() {
        expect(compareDates("01/01/0001", "01/01/0001")).toBe(0);
        expect(compareDates("06/22/1992", "06/22/1992")).toBe(0);
        expect(compareDates("07/13/2016", "07/13/2016")).toBe(0);
        expect(compareDates("03/04/1991", "03/04/1991")).toBe(0);
        expect(compareDates("02/02/2020", "02/02/2020")).toBe(0);
        expect(compareDates("11/22/1963", "11/22/1963")).toBe(0);
    });

    it("and should return positive number if first date should come after", function() {
        expect(compareDates("02/02/0002", "01/01/0001")).toBeGreaterThan(0);
        expect(compareDates("06/22/1993", "06/22/1992")).toBeGreaterThan(0);
        expect(compareDates("07/13/2016", "07/12/2016")).toBeGreaterThan(0);
        expect(compareDates("07/04/1776", "06/04/1776")).toBeGreaterThan(0);
        expect(compareDates("12/21/1221", "10/01/1001")).toBeGreaterThan(0);
        expect(compareDates("12/22/2222", "11/11/1111")).toBeGreaterThan(0);
    });

    it("and should return negative number if first date should come first", function() {
        expect(compareDates("01/01/0001", "02/02/0002")).toBeLessThan(0);
        expect(compareDates("06/22/1992", "06/22/1993")).toBeLessThan(0);
        expect(compareDates("07/12/2016", "07/13/2016")).toBeLessThan(0);
        expect(compareDates("06/04/1776", "07/04/1776")).toBeLessThan(0);
        expect(compareDates("10/01/1001", "12/21/1221")).toBeLessThan(0);
        expect(compareDates("11/11/1111", "12/22/2222")).toBeLessThan(0);
    });
});