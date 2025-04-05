// Check authentication
if (localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'index.html';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'index.html';
});

// Initialize data array
let employeeData = [];
let currentEmployeeId = null;

// Load data from CSV file
async function loadFromCSV() {
    try {
        const response = await fetch('http://localhost:8000/employee_data.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim());
        
        // Skip header row and parse data
        if (rows.length > 1) {
            employeeData = rows.slice(1).map(row => {
                const [id, name, gender, department, salary, address, timestamp] = row.split(',').map(field => field.trim());
                return {
                    id,
                    name,
                    gender,
                    department,
                    salary: parseFloat(salary),
                    address,
                    timestamp: timestamp || new Date().toISOString()
                };
            });
            updateDataTable();
        }
    } catch (error) {
        console.error('Error loading CSV file:', error);
        alert('Error loading employee data. Please make sure the server is running.');
    }
}

// Save data to CSV file
async function saveToCSV() {
    try {
        // Create CSV content
        const headers = ['Employee ID', 'Name', 'Gender', 'Department', 'Salary', 'Address', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...employeeData.map(emp => [
                emp.id,
                emp.name,
                emp.gender,
                emp.department,
                emp.salary,
                emp.address,
                emp.timestamp
            ].join(','))
        ].join('\n');

        // Send to server
        const response = await fetch('http://localhost:8000/save_csv', {
            method: 'POST',
            body: csvContent,
            headers: {
                'Content-Type': 'text/csv'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to save data');
        }
    } catch (error) {
        console.error('Error saving CSV file:', error);
        alert('Error saving employee data. Please make sure the server is running.');
    }
}

// Employee Form Submission
document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const employeeName = document.getElementById('employeeName').value;
    const gender = document.getElementById('gender').value;
    const department = document.getElementById('department').value;
    const salary = document.getElementById('salary').value;
    const address = document.getElementById('address').value;
    
    if (employeeId && employeeName && gender && department && salary && address) {
        const newEmployee = {
            id: employeeId,
            name: employeeName,
            gender: gender,
            department: department,
            salary: parseFloat(salary),
            address: address,
            timestamp: new Date().toISOString()
        };
        
        // Check if employee ID already exists
        const existingIndex = employeeData.findIndex(emp => emp.id === employeeId);
        if (existingIndex >= 0 && !currentEmployeeId) {
            alert('Employee ID already exists!');
            return;
        }
        
        if (currentEmployeeId) {
            // Update existing employee
            employeeData = employeeData.map(emp => 
                emp.id === currentEmployeeId ? newEmployee : emp
            );
            currentEmployeeId = null;
        } else {
            // Add new employee
            employeeData.push(newEmployee);
        }
        
        saveToCSV(); // Save to CSV file
        updateDataTable();
        this.reset();
    }
});

// Update the data table
function updateDataTable() {
    const tableDiv = document.getElementById('dataTable');
    let tableHTML = `
        <table>
            <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Address</th>
                <th>Actions</th>
            </tr>
    `;
    
    employeeData.forEach(employee => {
        tableHTML += `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.gender}</td>
                <td>${employee.department}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td>${employee.address}</td>
                <td>
                    <button class="btn modify-btn" onclick="editEmployee('${employee.id}')">Modify</button>
                    <button class="btn delete-btn" onclick="deleteEmployee('${employee.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</table>';
    tableDiv.innerHTML = tableHTML;
}

// Edit employee
function editEmployee(employeeId) {
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('gender').value = employee.gender;
    document.getElementById('department').value = employee.department;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('address').value = employee.address;
    
    currentEmployeeId = employeeId;
}

// Delete employee
function deleteEmployee(employeeId) {
    if (confirm('Are you sure you want to delete this employee record?')) {
        employeeData = employeeData.filter(emp => emp.id !== employeeId);
        saveToCSV(); // Save to CSV file after deletion
        updateDataTable();
    }
}

// Modify entry (for the Modify button)
function modifyEntry() {
    const employeeId = document.getElementById('employeeId').value;
    if (!employeeId) {
        alert('Please select an employee to modify');
        return;
    }
    
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (employee) {
        editEmployee(employeeId);
    } else {
        alert('Employee not found');
    }
}

// Delete entry (for the Delete button)
function deleteEntry() {
    const employeeId = document.getElementById('employeeId').value;
    if (!employeeId) {
        alert('Please select an employee to delete');
        return;
    }
    
    deleteEmployee(employeeId);
}

// Load data when page loads
loadFromCSV();

// Initialize the data table
updateDataTable(); 