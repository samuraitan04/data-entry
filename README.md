# Employee Data Entry Form

A web application that allows users to collect and manage employee data with CSV file storage.

## Features

- Secure login system
- Employee data entry form
- Data storage in CSV format
- Edit and delete capabilities
- Responsive design

## Setup Instructions

1. Clone or download this repository to your local machine.

2. Make sure you have Python 3.x installed on your system.

3. Start the server:
   ```bash
   python server.py
   ```
   This will start the server on port 8000.

4. Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```

## Login Credentials

For demonstration purposes, use the following credentials:
- Username: `admin`
- Password: `password`

## Usage

1. Log in using the provided credentials.

2. The employee form allows you to enter:
   - Employee ID
   - Employee Name
   - Gender
   - Department
   - Salary
   - Address

3. Use the buttons to:
   - Save: Add new employee or save changes
   - Modify: Edit existing employee details
   - Delete: Remove an employee record
   - Reset: Clear the form

4. All data is automatically saved to `employee_data.csv` in the same directory.

## Data Persistence

- Employee data is stored in a CSV file (`employee_data.csv`)
- The file is automatically created if it doesn't exist
- Data is loaded when the page opens
- Changes are saved immediately to the CSV file

## Notes

- This implementation includes both frontend and backend components
- The server handles CSV file operations
- Make sure the server is running before using the application
- The CSV file is stored in the same directory as the server script

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Python (for the server)
- CSV for data storage 