var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');

function connectToDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Aayan1234#",
        database: "internship_management"
    });
}

exports.signupCompany = (res, body, mySess) => {
    const { company_name, email, password, location } = body;
    if (!company_name || !email || !password) { fs.readFile(path.join(__dirname, 'html', 'pages', 'company_signup.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('All fields are required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('INSERT INTO companies (company_name, email, password, location) VALUES (?, ?, ?, ?)', [company_name, email, password, location], (err) => {
        con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'company_signup.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error signing up');</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};

exports.signupStudent = (res, body, mySess) => {
    const { student_name, email, password, resume } = body;
    if (!student_name || !email || !password) { fs.readFile(path.join(__dirname, 'html', 'pages', 'student_signup.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('All fields are required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('INSERT INTO students (student_name, email, password, resume) VALUES (?, ?, ?, ?)', [student_name, email, password, resume], (err) => {
        con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'student_signup.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error signing up');</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};

exports.loginCompany = (res, body, mySess) => {
    const { email, password } = body;
    const con = connectToDB(); con.connect();
    con.query('SELECT * FROM companies WHERE email = ? AND password = ?', [email, password], (err, result) => {
        con.end(); if (err || !result.length) { fs.readFile(path.join(__dirname, 'html', 'pages', 'company_login.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('error').innerHTML = 'Invalid credentials';</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};

exports.loginStudent = (res, body, mySess) => {
    const { email, password } = body;
    const con = connectToDB(); con.connect();
    con.query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password], (err, result) => {
        con.end(); if (err || !result.length) { fs.readFile(path.join(__dirname, 'html', 'pages', 'student_login.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('error').innerHTML = 'Invalid credentials';</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};