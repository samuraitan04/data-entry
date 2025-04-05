from flask import Flask, send_file, request, send_from_directory
import csv
import os
from io import StringIO

app = Flask(__name__)

# Enable CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/employee_data.csv')
def get_csv():
    try:
        return send_file('employee_data.csv', mimetype='text/csv')
    except FileNotFoundError:
        # Create new CSV file with headers
        headers = ['Employee ID', 'Name', 'Gender', 'Department', 'Salary', 'Address', 'Timestamp']
        csv_content = ','.join(headers) + '\n'
        return csv_content, 200, {'Content-Type': 'text/csv'}

@app.route('/save_csv', methods=['POST'])
def save_csv():
    csv_content = request.data.decode('utf-8')
    with open('employee_data.csv', 'w') as file:
        file.write(csv_content)
    return 'Data saved successfully'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000))) 