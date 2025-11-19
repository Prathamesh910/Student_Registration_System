// HTML elements

const studentForm = document.getElementById("form");
const recordTable = document.getElementById("records_table");
const studentName = document.getElementById("name");
const studentID = document.getElementById("id");
const emailID = document.getElementById("emailid");
const contactNumber = document.getElementById("number");

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
                <button class="action-btn delete-btn" onclick="deleteRecord(${index})">Delete</button>
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

// Loade exsiting records when page loades
displayRecords(studentRecords);
