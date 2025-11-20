// HTML elements

const studentForm = document.getElementById("form");
const recordTable = document.getElementById("records_table");
const studentName = document.getElementById("name");
const studentID = document.getElementById("id");
const emailID = document.getElementById("emailid");
const contactNumber = document.getElementById("number");
const mainButton = document.getElementById("submitbtn");

// Track curruntly editing record
let isEditing = false;
let editingIndex = -1;

// Local storage

// Key
const STORAGE_KEY = "studentRecords";

// Student data array

let studentRecords = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // Checks if the data exists in local storage. if yes, then parse it, start with an empty array.

//Save the current student record array to local storage.

function saveRecordsToLocalStorage(records) {
  // Use local storage to persist data

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

  displayRecords(records);
}

//Function to display records

function displayRecords(records) {
  // clear existing content

  recordTable.innerHTML = "";

  // check if the records array is empty
  if (records.length === 0) {
    recordTable.innerHTML =
      '<p style = "text-align: center; color: #666;">No student records found. Start by adding new students!</p>';

    //No scrollbar
    recordTable.classList.remove("scrollable");
    return;
  }

  //Table structure
  const table = document.createElement("table");
  table.classList.add("student-table");

  //Header row
  table.innerHTML = `
      <thead>
      <tr>
      <th>Name</th>
      <th>ID</th>
      <th>Email</th>
      <th>Mobile No.</th>
      <th style="width: 150px;">Actions</th>
      </tr>

      </thead>
      <tbody id="studentTableBody">
      </tbody>

`;

  const tbody = table.querySelector("#studentTableBody");

  // For every student in record, create a new empty row in the table

  records.forEach((student, index) => {
    const row = tbody.insertRow();

    //Cells

    row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.id}</td>
    <td>${student.email}</td>
    <td>${student.contact}</td>
    <td>
                <button class="action-btn edit-btn" onclick="editRecord(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
               `;
  });

  recordTable.appendChild(table);

  //Adding scrollbar

  // If content height exceeds max height (400px)
  //Activate overflow-y: auto by adding "scrollable" to the container class

  if (
    recordTable.scrollHeight > recordTable.clientHeight ||
    records.length > 5
  ) {
    recordTable.classList.add("scrollable");
  } else {
    recordTable.classList.remove("scrollable");
  }
}

// Validation

function alphabetical(str) {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (
      charCode !== 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
  }
  return true;
}

function checkValidity(input) {
  const value = input.value.trim();
  let isValid = true;

  if (!input.checkValidity()) {
    isValid = false;
  } else if (input.id === "name") {
    if (!alphabetical(value)) {
      isValid = false;
    }
  } else if (input.id === "id") {
    if (isNaN(Number(value)) || value.includes(" ")) {
      isValid = false;
    }
  } else if (input.id === "number") {
    const isNumeric = !isNaN(Number(value));
    const hasMinLength = value.length >= 10;

    if (!isNumeric || !hasMinLength || value.includes(" ")) {
      isValid = false;
    }
  }

  //CSS feedback

  input.classList.toggle("invalid", !isValid);

  return isValid;
}

//              OPERATIONS

// Adding new students
function formSubmit(event) {
  event.preventDefault();

  const nameValid = checkValidity(studentName);
  const idValid = checkValidity(studentID);
  const emailValid = checkValidity(emailID);
  const contactValid = checkValidity(contactNumber);

  if (!nameValid || !idValid || !emailValid || !contactValid) {
    alert("Validation failed!");
    return;
  }

  //Creating new student object
  const newStudent = {
    name: studentName.value.trim(),
    id: studentID.value.trim(),
    email: emailID.value.trim(),
    contact: contactNumber.value.trim(),
  };

  if (isEditing) {
    studentRecords[editingIndex] = newStudent;
    alert(`${newStudent.name}'s record has been successfully updated.`);
  } else {
    studentRecords.push(newStudent);
    alert(`New student ${newStudent.name} registered.`);
  }

  resetForm();
  saveRecordsToLocalStorage(studentRecords);
}

//Load data for editing

function editRecord(index) {
  const student = studentRecords[index];

  studentName.value = student.name;
  studentID.value = student.id;
  emailID.value = student.email;
  contactNumber.value = student.contact;

  isEditing = true;
  editingIndex = index;

  mainButton.textContent = "Save Changes";
  mainButton.style.backgroundColor = "#ffc107";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//Delete student

function deleteStudent(index) {
  const name = studentRecords[index].name;

  if (confirm(`Delete record for ${name}?`)) {
    studentRecords.splice(index, 1);

    if (index === editingIndex) {
      resetForm();
    }

    saveRecordsToLocalStorage(studentRecords);
    alert(`${name}'s record was deleted.`);
  }
}

//Reset form

function resetForm() {
  studentForm.reset();
  isEditing = false;
  editingIndex = -1;
  mainButton.textContent = "Add Student";
  mainButton.style.backgroundColor = "#28a745";

  const inputs = [studentName, studentID, emailID, contactNumber];
  inputs.forEach((input) => {
    input.classList.remove("invalid");
  });
}

//Events

studentForm.addEventListener("submit", formSubmit);

[studentName, studentID, emailID, contactNumber].forEach((input) => {
  input.addEventListener("input", () => checkValidity(input));
});

// Loade exsiting records when page loades
displayRecords(studentRecords);
