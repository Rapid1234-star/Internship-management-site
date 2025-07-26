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

exports.createInternship = (res, body, mySess) => {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': '/company_login.html'}); res.end(); return; }
    const { title, location, type, skills, salary, duration, deadline } = body;
    if (!title || !location || !type || !skills || !salary || !duration || !deadline) { fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: All fields are required';</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error: Company not found';</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('INSERT INTO internships (company_id, title, location, type, skills, salary, duration, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [company_id, title, location, type, skills, salary, duration, deadline], (err) => {
            con.end(); if (err) { fs.readFile(path.join(__dirname, 'html', 'pages', 'newinternshipcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>document.getElementById('status').textContent = 'Error creating internship: ' + err.message;</script>"); }); } else { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Internship posted!');</script>"); }); }
        });
    });
};

exports.editInternship = (res, body, mySess) => {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': '/company_login.html'}); res.end(); return; }
    const { internship_id, title, location, type, skills, salary, duration, deadline } = body;
    if (!internship_id || !title || !location || !type || !skills || !salary || !duration || !deadline) { fs.readFile(path.join(__dirname, 'html', 'pages', 'editinternship.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('All fields are required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'editinternship.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('UPDATE internships SET title = ?, location = ?, type = ?, skills = ?, salary = ?, duration = ?, deadline = ? WHERE internship_id = ? AND company_id = ?', [title, location, type, skills, salary, duration, deadline, internship_id, company_id], (err) => {
            con.end();
            if (err) {
                fs.readFile(path.join(__dirname, 'html', 'pages', 'editinternship.html'), (err, data) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data + "<script>alert('Error updating internship: ' + err.message + '')</script>");
                });
            } else {
                fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data + "<script>alert('Internship updated!')</script>");
                });
            }
        });
    });
};

exports.deleteInternship = (res, body, mySess) => {
    if (!mySess.getMySession().userName) { res.writeHead(302, {'Location': '/company_login.html'}); res.end(); return; }
    const { internship_id } = body;
    if (!internship_id) { fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Internship ID is required');</script>"); }); return; }
    const con = connectToDB(); con.connect();
    con.query('SELECT company_id FROM companies WHERE email = ?', [mySess.getMySession().userName], (err, result) => {
        if (err || !result.length) { con.end(); fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data + "<script>alert('Company not found');</script>"); }); return; }
        const company_id = result[0].company_id;
        con.query('DELETE FROM internships WHERE internship_id = ? AND company_id = ?', [internship_id, company_id], (err) => {
            con.end();
            if (err) {
                fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data + "<script>alert('Error deleting internship: ' + err.message + '')</script>");
                });
            } else {
                fs.readFile(path.join(__dirname, 'html', 'pages', 'dashboardcompany.html'), (err, data) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data + "<script>alert('Internship deleted!')</script>");
                });
            }
        });
    });
};