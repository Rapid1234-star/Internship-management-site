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

exports.updateCompanyProfile = (res, body, mySess) => {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': '/company_login'}); res.end(); return; }
    const { company_name, email, password, location } = body;
    if (!company_name || !email || !password || !location) { fs.readFile(path.join(__dirname, 'html', 'pages', 'profilecompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('All fields are required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('UPDATE companies SET company_name = ?, email = ?, password = ?, location = ? WHERE email = ?', [company_name, email, password, location, mySess.getMySession().userName], (err) => {
        con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'profilecompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error updating profile');</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};

exports.updateStudentProfile = (res, body, mySess) => {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': '/student_login'}); res.end(); return; }
    const { student_name, email, password, resume } = body;
    if (!student_name || !email || !password || !resume) { fs.readFile(path.join(__dirname, 'html', 'pages', 'profilestudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('All fields are required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('UPDATE students SET student_name = ?, email = ?, password = ?, resume = ? WHERE email = ?', [student_name, email, password, resume, mySess.getMySession().userName], (err) => {
        con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'profilestudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Error updating profile');</script>"); }); } else { mySess.setMySession(email); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardstudent.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }
    });
};