var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aayan1234#",
    database: "internship_management"
});

con.connect((err) => { if (err) throw err; console.log("Connected!"); ['CREATE TABLE companies (company_id INT PRIMARY KEY AUTO_INCREMENT, company_name VARCHAR(100), email VARCHAR(255), password VARCHAR(50), location VARCHAR(100))', 'CREATE TABLE students (student_id INT PRIMARY KEY AUTO_INCREMENT, student_name VARCHAR(100), email VARCHAR(255), password VARCHAR(50), resume TEXT)', 'CREATE TABLE internships (internship_id INT PRIMARY KEY AUTO_INCREMENT, company_id INT, title VARCHAR(100), location VARCHAR(100), type VARCHAR(50), skills VARCHAR(255), salary DECIMAL(11,2), duration VARCHAR(50), deadline DATE, FOREIGN KEY (company_id) REFERENCES companies(company_id))', 'CREATE TABLE applications (application_id INT PRIMARY KEY AUTO_INCREMENT, student_id INT, internship_id INT, status VARCHAR(20), resume TEXT, FOREIGN KEY (student_id) REFERENCES students(student_id), FOREIGN KEY (internship_id) REFERENCES internships(internship_id))'].forEach(sql => con.query(sql, (err) => { if (err) throw err; console.log("Table created"); })); con.end(); });