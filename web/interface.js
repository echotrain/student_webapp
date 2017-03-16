// JavaScript Files
/* global $ Cookies */

//TODO: learn everything about angular, conversion starts now...

let students = [];
let images;
let deletedStudents = [];

let schoolYears = {
    1: "Freshman",
    2: "Sophomore",
    3: "Junior",
    4: "Senior"
};

// returns the name of the grade given the year
function getSchoolYear(grade) {
    return schoolYears[grade];
}


// =============== DOM manipulation functions =============== //
$(document).ready(function() {
    
    let studentList;
    let getStudentCalls = [];
    
    // AJAX student data and the student images
    $.getJSON("/img/images.json", function(data) {
        images = data;
        $.get('/api/v1/students.json', function(data) {
            studentList = data;
        }).done(function() {
            //get the data for 10 students
            for(let i = 0; i < 10; i++) {
                getStudentCalls.push($.get(`/api/v1/students/${studentList[i]}.json`, function(student) {
                    student.id = studentList[i];
                    students.push(student);
                }));
            }
            //display the data when all ten calls are made
            $.when(...getStudentCalls).done(function() {
                // console.log(students);
                displayData();
                checkCookies();
            });
        });
    });
    
    
    // ============================ MODALS ============================ //
    // ================================================================ //
    
    // --------------------- add new student modal -------------------- //
    $('#addNewStudent').click(function() {
        $('#saveButtonDiv').empty();
        $('#saveButtonDiv').html(`<input id="formSubmit" type="submit" class="btn btn-success" value="Add" data-dismiss="modal">`);
        
        // $('#studentForm').find('input, select').val('');
        $('#dataFormModal').modal();
        
        $('#formSubmit').click(function() {
            let newStudent = {};
            
            newStudent.fname = $('#inputFirstName').val();
            newStudent.lname = $('#inputLastName').val();
            newStudent.phone = $('#inputPhone').val();
            newStudent.startDate = $('#inputStartDate').val();
            newStudent.year = $('#selectSchoolYear').val();
            newStudent.street = $('#inputStreet').val();
            newStudent.city = $('#inputCity').val();
            newStudent.state = $('#selectState').val();
            newStudent.zip = $('#inputZip').val();
            
            $('#studentForm').submit(postNewStudent(newStudent));
        });
        
    });
    
    function postNewStudent(student) {
        $.post('/api/v1/students', student, function(newID) {
            student.id = newID;
            students.push(student);
        }).done(function() {
            // console.log(students);
            checkCookies();
            displayData();
            // console.log("a student has been added.");
        });
    }
    
    // --------------------- restore student modal -------------------- //
    $('#restoreStudent').click(function() {
        if (deletedStudents[0]) {
            // console.log("well it's not empty...");
            let revenant = JSON.parse(JSON.stringify(deletedStudents.pop()));
            delete revenant.id;
            
            $.post('/api/v1/students', revenant, function(newID) {
                revenant.id = newID;
                students.push(revenant);
            }).done(function() {
                // console.log(students);
                checkCookies();
                displayData();
                // console.log("the revenant has appeared.");
            });
            if (deletedStudents[0] === undefined) {
                $('#restoreStudent').hide();
            }
        }
    });
    
    // ---------------------- edit student modal ---------------------- //
    function editStudentModal(element) {
        $(element).click(function() {
            let selectedStudent = students[$(this).parent().attr('id')];
            
            $('#saveButtonDiv').empty();
            $('#saveButtonDiv').html(`<input id="formSubmit" type="submit" class="btn btn-success" value="Save" data-dismiss="modal">`);
            
            $('#inputFirstName').val(selectedStudent.fname);
            $('#inputLastName').val(selectedStudent.lname);
            $('#inputPhone').val(selectedStudent.phone);
            $('#inputStartDate').val(selectedStudent.startDate);
            $('#selectSchoolYear').val(selectedStudent.year);
            $('#inputStreet').val(selectedStudent.street);
            $('#inputCity').val(selectedStudent.city);
            $('#selectState').val(selectedStudent.state);
            $('#inputZip').val(selectedStudent.state);
            
            $('#dataFormModal').modal();
            
            $('#formSubmit').click(function() {
                
                selectedStudent.fname = $('#inputFirstName').val();
                selectedStudent.lname = $('#inputLastName').val();
                selectedStudent.phone = $('#inputPhone').val();
                selectedStudent.startDate = $('#inputStartDate').val();
                selectedStudent.year = $('#selectSchoolYear').val();
                selectedStudent.street = $('#inputStreet').val();
                selectedStudent.city = $('#inputCity').val();
                selectedStudent.state = $('#selectState').val();
                selectedStudent.zip = $('#inputZip').val();
                
                $('#studentForm').submit(putEditedStudent(selectedStudent));
            });
        });
    }
    
    function putEditedStudent(student) {
        let editedStudent = JSON.parse(JSON.stringify(student));
        let file = editedStudent.id;
        delete editedStudent.id;
        // console.log(student);
        
        $.ajax({
            url: `/api/v1/students/${file}.json`,
            type: 'PUT',
            data: editedStudent
        })
        .done(function() {
            checkCookies();
            displayData();
        });
    }
    
    // --------------------- delete student modal --------------------- //
    function deleteStudentModal(element) {
        $(element).click(function() {
            let selectedStudent = students[$(this).parent().attr('id')];
            let imgIndex = `${selectedStudent.lname}-${selectedStudent.fname}`;
            
            $('#deleteButtonDiv').html('<button id="confirmDeleteButton" type="button" class="btn btn-danger" data-dismiss="modal">DELETE</button>');
            
            $('#studentToDelete').html(`<p>Are you sure you want to delete</p>
                                        <p><b>${selectedStudent.fname} ${selectedStudent.lname}</b></p>
                                        <div id="studentModalFrame">
                                            <img src="${images[imgIndex]}" alt="pic">
                                        </div>
                                        <p>${getSchoolYear(selectedStudent.year)}<br/>${selectedStudent.city}, ${selectedStudent.state}</p><br/>`);
            $('#confirmDeleteModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            
            $('#confirmDeleteButton').click(function() {
                deletedStudents.push(selectedStudent);
                students.splice(students.indexOf(selectedStudent), 1);
                
                //delete REST call
                $.ajax({
                    url: `/api/v1/students/${selectedStudent.id}.json`,
                    type: 'DELETE'
                })
                .done(function() {
                    // console.log("success");
                    displayData();
                    $('#confirmDeleteModal').modal('hide');
                    $('#restoreStudent').show();
                });
                $('#deleteButtonDiv').empty();
            });
        });
    }
    
    // ---------------------- student info modal ---------------------- //
    function studentInfoModal(element) {
        
        $(element).click(function() {
            let index = $(this).parent().attr('id');
            let imgIndex = `${students[index].lname}-${students[index].fname}`;
            
            $('#modalData').empty().append(
                `<div class="modal-content text-center">
                    <div class="modal-header">
                        <h4 class="modal-title">${students[index].fname} ${students[index].lname}</h4>
                    </div>
                    <div class="modal-body">
                        <div id="studentModalFrame">
                            <img src="${images[imgIndex]}" alt="pic">
                        </div>
                        <p>${getSchoolYear(students[index].year)}<br/>${students[index].city}, ${students[index].state}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>`);
            // activate modal
            $('#studentModal').modal({
                backdrop: true
            });
        });
    }
    
    
    // ============================ DISPLAY ============================ //
    // ================================================================= //
    
    // ====== function to display the student data ====== //
    function displayData() {
        $('#tableData').empty();
        $('#tileData').empty();
        $(students).each(function(index, student) {
            let imgIndex = `${student.lname}-${student.fname}`;
            $('#tableData').append(`<tr id="${index}">
                                    <td class="clickRow"> ${getSchoolYear(student.year)} </td>
                                    <td class="clickRow"> ${student.lname}, ${student.fname} </td>
                                    <td class="clickRow"> ${student.startDate} </td>
                                    <td class="clickRow"> ${student.street} </td>
                                    <td class="clickRow"> ${student.city} </td>
                                    <td class="clickRow"> ${student.state} </td>
                                    <td class="clickRow"> ${student.zip} </td>
                                    <td class="clickRow"> ${student.phone} </td>
                                    <td class="editItem text-center" title="Edit Student"><div class="glyphicon glyphicon-wrench editItemButton"></div></td>
                                    <td class="deleteItem text-center" title="Delete Student"><div class="glyphicon glyphicon-trash deleteItemButton"></div></td>
                                </tr>`);
        
        $('#tileData').append(`<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                <div id="${student.lname}-${student.fname}" class="panel customTile1">
                                    <div class="panel-heading">
                                        <h3 class="panel-title"><b>${student.fname} ${student.lname}<b></h3>
                                    </div>
                                    <div class="panel-body text-center customTile2">
                                        <img id="tileImg" src="${images[imgIndex]}" alt="pic" class="img-circle">
                                        <p>${student.street}<br/>${student.city}, ${student.state} ${student.zip}</p>
                                    </div>
                                    <div class="panel-footer customTile3">
                                        <p>Year: ${getSchoolYear(student.year)}<br/>Start Date: ${student.startDate}<br/>Phone: ${student.phone}</p>
                                    </div>
                                </div>
                            </div>`);
        });
        
        // adds click handling to given elements to display the modals
        studentInfoModal('.clickRow');
        editStudentModal('.editItem');
        deleteStudentModal('.deleteItem');
    }
    
    // set the style of the display depending on click of table or tile
    $('#tableView').click(function() {
        setTableView();
    });
    $('#tileView').click(function() {
        setTileView();
    });
    
    function setTableView() {
        $('#tableView').toggleClass('active', true);
        $('#tileView').toggleClass('active', false);
        $('#table-style').show();
        $('#tile-style').hide();
        Cookies.set('default', 'table');
    }
    
    function setTileView() {
        $('#tileView').toggleClass('active', true);
        $('#tableView').toggleClass('active', false);
        $('#tile-style').show();
        $('#table-style').hide();
        Cookies.set('default', 'tiles');
    }
    
    // == function to check the cookie and set the user preference == //
    function checkCookies() {
        if (Cookies.get('default') === 'tiles') {
            if (Cookies.get('sort')) {
                sortStudentData(Cookies.get('sort'));
                sortDisplay($('#' + Cookies.get('sort')), Cookies.get('icon'));
            }
            setTileView();
        }
        else {
            setTableView();
            if (Cookies.get('sort')) {
                sortStudentData(Cookies.get('sort'));
                sortDisplay($('#' + Cookies.get('sort')), Cookies.get('icon'));
            }
        }
    }
    
    // === functions to manipulate the table display and call the sort functions === //
    $('.sortTable').click(function() {
        //call the sortDisplay helper function
        sortDisplay($(this), $(this).find('span').attr('class'));
        
        //reset the icons on all the other column headers
        $('.sortTable').not(this).each(function() {
            $(this).find('span').removeAttr('class');
            $(this).find('span').attr('class', 'glyphicon glyphicon-sort iconHide');
        });
    });
    //sortDisplay helper function to display user selected sorts
    function sortDisplay(element, icon) {
        // change table column header icon
        let sortSpan = element.find('span');
        let sortType = element.attr('id');
        
        let orderKey = ["glyphicon glyphicon-sort-by-alphabet", "glyphicon glyphicon-sort-by-order", "glyphicon glyphicon-sort-by-attributes"];
        let reverseKey = ["glyphicon glyphicon-sort-by-alphabet-alt", "glyphicon glyphicon-sort-by-order-alt", "glyphicon glyphicon-sort-by-attributes-alt"];
        let alphaKey = ["fname", "lname", "street", "city", "state"];
        let numericKey = ["zip", "phone"];
        
        let orderIndex = $.inArray(icon, orderKey);
        let reverseIndex = $.inArray(icon, reverseKey);
        
        if (orderKey.includes(icon)) {
            students.reverse();
            sortSpan.removeAttr('class');
            sortSpan.attr('class', reverseKey[orderIndex]);
        }
        else {
            sortStudentData(sortType);
            sortSpan.removeAttr('class');
            if (reverseKey.includes(icon)) {
                sortSpan.attr('class', orderKey[reverseIndex]);
            }
            else {
                if (alphaKey.includes(sortType)) {
                    sortSpan.attr('class', orderKey[0]);
                }
                else if (numericKey.includes(sortType)) {
                    sortSpan.attr('class', orderKey[1]);
                }
                else {
                    sortSpan.attr('class', orderKey[2]);
                }
            }
        }
        // dispaly the loading modal
        loadingModal();
        // output the data once sorted
        setTimeout(displayData, 800);
        //set cookie to save user selected sort
        Cookies.set('sort', sortType);
        Cookies.set('icon', icon);
    }
    
    // ====== function to display loading modal ====== //
    function loadingModal() {
        $('#refreshModal').modal('show');
        // set the callback timeout interval
        setTimeout(function() {
            $('#refreshModal').modal('hide');
        }, 2000);
    }
    
    // ====== activate the tooltips ====== //
    $('[data-toggle="tooltip"]').tooltip();
});