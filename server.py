from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import csv
import os

class CSVHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/employee_data.csv':
            try:
                with open('employee_data.csv', 'r') as file:
                    self.send_response(200)
                    self.send_header('Content-type', 'text/csv')
                    self.end_headers()
                    self.wfile.write(file.read().encode())
            except FileNotFoundError:
                # If file doesn't exist, create it with headers
                with open('employee_data.csv', 'w') as file:
                    writer = csv.writer(file)
                    writer.writerow(['Employee ID', 'Name', 'Gender', 'Department', 'Salary', 'Address', 'Timestamp'])
                self.send_response(200)
                self.send_header('Content-type', 'text/csv')
                self.end_headers()
                self.wfile.write(b'Employee ID,Name,Gender,Department,Salary,Address,Timestamp\n')
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/save_csv':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            csv_content = post_data.decode('utf-8')

            with open('employee_data.csv', 'w') as file:
                file.write(csv_content)

            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Data saved successfully')
            return

def run_server():
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, CSVHandler)
    print(f'Server running on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server() 